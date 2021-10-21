import fb from '../firebase';

const numericRegex = /\d{3,}/;
const stringRegex = /\D+/;

function enrichEntry(entry) {
  return { ...entry, description: `${entry.plz ? `${entry.plz} ` : ''}${entry.name}` };
}

function average(numberArray) {
  const { count, sum } = numberArray.reduce((agg, curr) => ({ count: agg.count + 1, sum: agg.sum + curr }), { count: 0, sum: 0 });
  return sum / count;
}

export async function getSuggestions(searchString) {
  const plzMatch = searchString.match(numericRegex);
  const locationMatch = searchString.match(stringRegex);
  const location = locationMatch !== null ? locationMatch[0].trim() : '';

  if (plzMatch !== null) {
    const [plz] = plzMatch;
    const query = fb.store.collection('geo-data').orderBy('plz').startAt(plz).endAt(`${plz}\uf8ff`);

    const entries = (await query.get()).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return entries.filter((e) => {
      const needle = location.toLowerCase();
      const haystack = e.name.toLowerCase();
      return haystack.includes(needle) || needle.includes(haystack);
    }).map(enrichEntry);
  }

  const query = fb.store.collection('geo-data').orderBy('name_lowercase').startAt(searchString.toLowerCase()).endAt(`${searchString.toLowerCase()}\uf8ff`);
  const entries = (await query.get()).docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const aggregated = entries
    .reduce((agg, curr) => ({
      ...agg,
      [curr.name]: [...(agg[curr.name] || []), curr],
    }), {});

  return Object.keys(aggregated)
    .map((key) => {
      const aggregatedEntries = aggregated[key];

      // We don't need to return a placeId here as we will enforce to have a zip code whenever the placeId matters
      return {
        name: key,
        lat: average(aggregatedEntries.map((e) => Number.parseFloat(e.lat))),
        lon: average(aggregatedEntries.map((e) => Number.parseFloat(e.lon))),
        description: key,
      };
    });
}

export async function getGeodataForString(searchString) {
  const [result] = await getSuggestions(searchString);
  return result;
}

export async function getGeodataForPlace(placeId) {
  const snapshot = await fb.store.collection('geo-data').doc(placeId).get();
  return enrichEntry(snapshot.data());
}

export function getLatLng(geoResult) {
  return { lat: Number.parseFloat(geoResult.lat), lng: Number.parseFloat(geoResult.lon) };
}
