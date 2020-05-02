export default function getUrlParamFromWindowLocation(windowLocation, parameter) {
  // Because we use the hash router, we cannot use the default functionality here as it would expect the query parameters before the hash
  const urlParams = new URLSearchParams(windowLocation.search);
  return urlParams.get(parameter);
}
