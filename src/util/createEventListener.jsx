export default function createEventListener(obj, event, fn) {
  obj.addEventListener(event, fn);
  return () => obj.removeEventListener(event, fn);
}
