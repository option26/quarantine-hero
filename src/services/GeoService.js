import fb from '../firebase';

const numericRegex = /\d{3,}/;
const stringRegex = /\D+/;

function enrichEntry(entry) {
  return { ...entry, description: `${entry.plz} ${entry.name}` };
}

export async function getSuggestions(searchString) {
  const plzMatch = searchString.match(numericRegex);
  const locationMatch = searchString.match(stringRegex);
  const location = locationMatch !== null ? locationMatch[0].trim() : '';

  let preResults;
  if (plzMatch !== null) {
    const plz = plzMatch[0];
    const query = fb.store.collection('geo-data').orderBy('plz').startAt(plz).endAt(`${plz}\uf8ff`);

    const entries = (await query.get()).docs.map((d) => ({ id: d.id, ...d.data() }));
    preResults = entries.filter((e) => e.name.includes(location));
  } else {
    const query = fb.store.collection('geo-data').orderBy('name').startAt(searchString).endAt(`${searchString}\uf8ff`);
    preResults = (await query.get()).docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  const existingLocationIds = new Set();
  return preResults
    .filter((d) => {
      const contained = existingLocationIds.has(d.locId);
      existingLocationIds.add(d.locId);
      return !contained;
    })
    .map(enrichEntry);
}

export async function getGeodataForString(searchString) {
  const result = await getSuggestions(searchString);
  return result[0];
}

export async function getGeodataForPlace(placeId) {
  const snapshot = await fb.store.collection('geo-data').doc(placeId).get();
  return enrichEntry(snapshot.data());
}

export function getLatLng(geoResult) {
  return { lat: Number.parseFloat(geoResult.lat), lng: Number.parseFloat(geoResult.lon) };
}
