const crypto = window.crypto || window.msCrypto;

export default async function createSha1Hash(message) {
  const hashBuffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(message));
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
