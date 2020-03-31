// eslint-disable-next-line no-undef
const geocoder = new google.maps.Geocoder();
// eslint-disable-next-line no-undef
const autocomplete = new google.maps.places.AutocompleteService();

export async function getSuggestions(searchString, searchOptions) {
  const request = {
    ...searchOptions,
    input: searchString,
  };
  return new Promise((resolve, reject) => autocomplete.getPlacePredictions(request, (result, status) => {
    switch (status) {
      case 'OK':
        return resolve(result);
      case 'ZERO_RESULTS':
        return resolve([]);
      default:
        return reject(status);
    }
  }));
}

export async function getGeodataForString(searchString, searchOptions) {
  const request = {
    ...searchOptions,
    address: searchString,
  };
  return new Promise((resolve, reject) => {
    geocoder.geocode(request, (results, status) => {
      if (status === 'OK') {
        return resolve(results);
      }
      return reject(status);
    });
  });
}

export async function getGeodataForPlace(placeId, searchOptions) {
  const request = {
    ...searchOptions,
    placeId,
  };
  return new Promise((resolve, reject) => {
    geocoder.geocode(request, (results, status) => {
      if (status === 'OK') {
        return resolve(results);
      }
      return reject(status);
    });
  });
}

export function getLatLng(geoResult) {
  return { lat: geoResult.geometry.location.lat(), lng: geoResult.geometry.location.lng() };
}
