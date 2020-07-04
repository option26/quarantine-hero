import * as admin from 'firebase-admin';
import axios, { AxiosResponse } from 'axios';
import { createHash } from 'crypto';

import { CollectionName } from '../types/enum/CollectionName';
import { Location } from '../types/interface/geoDB/Location';

export async function updateGeoDB(): Promise<void> {

    try {
        async function urlToObject(url: string, country: string) {
            const response: AxiosResponse = await axios.get(url);
            const rows = response.data.split('\n');
            if (typeof rows === 'undefined' || rows.length === 0) throw Error('Could not split result in rows');
            let keyRow = rows.shift();
            if (!keyRow) throw Error('Could not find key row');
            keyRow = keyRow.replace('#loc_id', 'locId');
            keyRow = keyRow.replace('vorwahl', 'telephonePrefix');
            keyRow = keyRow.replace('einwohner', 'inhabitants');
            keyRow = keyRow.replace('flaeche', 'area');
            const keys = keyRow.split('\t');
            return rows.map((row: string) => {
                return row.split('\t')
                    .map((entry: string, index: number): [string, number] => [entry, index])
                    .reduce<Location>((acc: Location, [entry, index]): Location => {
                        acc[keys[index]] = entry;
                        return acc;
                    }, <Location>{},
                    );
            }).map((place: Location) => ({ ...place, country }));
        }

        const countries = [
            'AT', 'CH', 'DE', 'LI'
        ];

        const db = admin.firestore();

        await Promise.all(countries.map(async (country) => {
            const url = `http://www.fa-technik.adfc.de/code/opengeodb/${country}.tab`;
            const results = await urlToObject(url, country);
            const resultsWithPlz = results.filter((loc: Location) => !!loc.plz && loc.invalid !== '1');

            //explode dataset with multiple plzs
            const expandedResults = resultsWithPlz.map((result: Location) => {
                const allPlz = result.plz.split(',');
                return allPlz.map((plz) => ({ ...result, plz }));
            }).reduce((acc: Location[], result: Location[]) => [...acc, ...result], []);

            // Hash map plz+name+land
            // on collision typ ort > typ gemeinde
            const hashMap: { [key: string]: Location } = {};
            expandedResults.map((result: Location) => {
                const dataHash = createHash('sha1').update(`${result.plz}${result.name}${result.country}`).digest('hex');
                if (hashMap.hasOwnProperty(dataHash)) {
                    const existingEntry = hashMap[dataHash];
                    if (existingEntry.typ === 'Gemeinde' && result.typ === 'Ort') {
                        hashMap[dataHash] = result;
                    } else if (
                        (existingEntry.typ === 'Gemeinde' && result.typ === 'Gemeinde' || existingEntry.typ === 'Ort' && result.typ === 'Ort') &&
                        existingEntry.locId >= result.locId) {
                        hashMap[dataHash] = result;
                    } else if (result.typ !== 'Gemeinde') {
                        // we never want to overwrite anything with gemeinde per se
                        // this is here so we encounter any unknown types
                        hashMap[dataHash] = result;
                    } else if (existingEntry.typ === 'Ort' && result.typ === 'Gemeinde') {
                        // DO NOTHING
                    } else {
                        console.log("collision", JSON.stringify(existingEntry), JSON.stringify(result));
                    }
                } else {
                    hashMap[dataHash] = result;
                }
            });

            const filteredResults = Object.keys(hashMap).map((key) => ({ ...hashMap[key], hash: key }));

            const locationCollection = db.collection(CollectionName.GeoData);
            const chunk = 400;
            const batchPromises = [];
            for (let i = 0, j = filteredResults.length; i < j; i += chunk) {
                const batch = db.batch();
                const tempArray = filteredResults.slice(i, i + chunk);
                tempArray.map((loc: Location) => {
                    if (!loc.locId) throw Error('Could not find locId for' + JSON.stringify(loc));
                    batch.set(locationCollection.doc(loc.hash), loc);
                });
                batchPromises.push(batch.commit());
            }
            await Promise.all(batchPromises);
        }));

    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
}
