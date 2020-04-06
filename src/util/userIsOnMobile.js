export default function userIsOnMobile() {
  // https://stackoverflow.com/a/31162741
  if (window.matchMedia('screen and (max-width: 768px)').matches) return true;
  return false;
}
