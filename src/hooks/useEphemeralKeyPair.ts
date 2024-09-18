import { EphemeralKeyPair } from "@aptos-labs/ts-sdk";

// Store ephemeral key pairs in localStorage (nonce -> ephemeralKeyPair)
export type StoredEphemeralKeyPair = { [nonce: string]: EphemeralKeyPair };

// Retrieve the ephemeral key pair with the given nonce from localStorage
export const getLocalEphemeralKeyPair = (
  nonce: string
): EphemeralKeyPair | null => {
  const keyPairs = getLocalEphemeralKeyPairs();

  // Get the account with the given nonce (the generated nonce of the ephemeral key pair may not match
  // the nonce in local storage), so we need to validate it before returning it (implementation specific).
  const ephemeralKeyPair = keyPairs[nonce];
  if (!ephemeralKeyPair) return null;

  // If the account is valid, return it, otherwise remove it from the device and return null
  return validateEpheemralKeyPair(nonce, ephemeralKeyPair);
};

// Validate the ephemeral key pair with the given nonce and the expiry timestamp. If the nonce does not match
// the generated nonce of the ephemeral key pair, the ephemeral key pair is removed from localStorage. This is
// to validate that the nonce algorithm is the same.
export const validateEpheemralKeyPair = (
  nonce: string,
  ephemeralKeyPair: EphemeralKeyPair
): EphemeralKeyPair | null => {
  // Check the nonce and the expiry timestamp of the account to see if it is valid
  if (
    nonce === ephemeralKeyPair.nonce &&
    ephemeralKeyPair.expiryDateSecs > BigInt(Math.floor(Date.now() / 1000))
  ) {
    return ephemeralKeyPair;
  }
  removeEphemeralKeypair(nonce);
  return null;
};

// Remove the ephemeral key pair with the given nonce from localStorage
export const removeEphemeralKeypair = (nonce: string): void => {
  const keyPairs = getLocalEphemeralKeyPairs();
  delete keyPairs[nonce];

  localStorage.setItem(
    "ephemeral-key-pairs",
    encodeEphemeralKeyPairs(keyPairs)
  );
};

// Retrieve all ephemeral key pairs from localStorage and decode them. The new ephemeral key pair
// is then stored in localStorage with the nonce as the key
export const storeEphemeralKeyPair = (
  ephemeralKeyPair: EphemeralKeyPair
): void => {
  // Retrieve the current ephemeral key pairs from local storage
  const accounts = getLocalEphemeralKeyPairs();

  // Store the new ephemeral key pair in local storage
  accounts[ephemeralKeyPair.nonce] = ephemeralKeyPair;

  if (typeof localStorage === "undefined") return;

  localStorage.setItem(
    "ephemeral-key-pairs",
    encodeEphemeralKeyPairs(accounts)
  );
};

// Retrieve all ephemeral key pairs from localStorage and decode them.
export const getLocalEphemeralKeyPairs = (): StoredEphemeralKeyPair => {
  const rawEphemeralKeyPairs =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("ephemeral-key-pairs")
      : null;
  try {
    return rawEphemeralKeyPairs
      ? decodeEphemeralKeyPairs(rawEphemeralKeyPairs)
      : {};
  } catch (error) {
    //eslint-disable-next-line no-console
    console.warn(
      "Failed to decode ephemeral key pairs from local storage",
      error
    );
    return {};
  }
};

// Encoding for the EphemeralKeyPair class to be stored in localStorage
const EphemeralKeyPairEncoding = {
  decode: (e: any) => EphemeralKeyPair.fromBytes(e.data),
  encode: (e: EphemeralKeyPair) => ({
    __type: "EphemeralKeyPair",
    data: e.bcsToBytes(),
  }),
};

// Stringfy the ephemeral key pairs to be stored in localStorage
export const encodeEphemeralKeyPairs = (
  keyPairs: StoredEphemeralKeyPair
): string =>
  JSON.stringify(keyPairs, (_, e) => {
    if (typeof e === "bigint") return { __type: "bigint", data: e.toString() };
    if (e instanceof Uint8Array)
      return { __type: "Uint8Array", data: Array.from(e) };
    if (e instanceof EphemeralKeyPair)
      return EphemeralKeyPairEncoding.encode(e);
    return e;
  });

// Parse the ephemeral key pairs from a string
export const decodeEphemeralKeyPairs = (
  encodedEphemeralKeyPairs: string
): StoredEphemeralKeyPair =>
  JSON.parse(encodedEphemeralKeyPairs, (_, e) => {
    if (e && e.__type === "bigint") return BigInt(e.data);
    if (e && e.__type === "Uint8Array") return Uint8Array.from(e.data);
    if (e && e.__type === "EphemeralKeyPair")
      return EphemeralKeyPairEncoding.decode(e);
    return e;
  });

export default function useEphemeralKeyPair() {
  const ephemeralKeyPair = EphemeralKeyPair.generate();
  storeEphemeralKeyPair(ephemeralKeyPair);

  return ephemeralKeyPair;
}
