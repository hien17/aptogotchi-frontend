"use client";

import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { getLocalEphemeralKeyPair } from "@/hooks/useEphemeralKeyPair";
import { EphemeralKeyPair } from "@aptos-labs/ts-sdk";
import { getAptosClient } from "@/utils/aptosClient";

const parseJWTFromURL = (url: string): string | null => {
  const urlObject = new URL(url);
  const fragment = urlObject.hash.substring(1);
  const params = new URLSearchParams(fragment);
  return params.get("id_token");
};

function CallbackPage() {
  const { setKeylessAccount } = useKeylessAccount();
  const router = useRouter();

  const [progress, setProgress] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return currentProgress + 1;
      });
    }, 50);

    async function deriveAccount() {
      const jwt = parseJWTFromURL(window.location.href);

      if (!jwt) {
        setHasError(true);
        setProgress(100);
        toast.error("No JWT found in URL. Please try logging in again.");
        return;
      }

      const payload = jwtDecode<{ nonce: string }>(jwt);

      const jwtNonce = payload.nonce;

      const ephemeralKeyPair = getLocalEphemeralKeyPair(jwtNonce);

      if (!ephemeralKeyPair) {
        setHasError(true);
        setProgress(100);
        toast.error(
          "No ephemeral key pair found. Please try logging in again."
        );
        return;
      }

      await createKeylessAccount(jwt, ephemeralKeyPair);
      clearInterval(interval);
      setProgress(100);
      router.push("/");
    }

    deriveAccount();
  }, []);

  const createKeylessAccount = async (
    jwt: string,
    ephemeralKeyPair: EphemeralKeyPair
  ) => {
    const aptosClient = getAptosClient();
    const keylessAccount = await aptosClient.deriveKeylessAccount({
      jwt,
      ephemeralKeyPair,
    });

    const accountCoinData = await aptosClient.getAccountCoinsData({
      accountAddress: keylessAccount?.accountAddress.toString(),
    });

    // account does not exist yet => fund it
    if (accountCoinData.length == 0) {
      try {
        await aptosClient.fundAccount({
          accountAddress: keylessAccount.accountAddress,
          amount: 200000000, // faucet 2 APT to create new use
        });
      } catch (error) {
        console.log("Error funding account", error);
        toast.error(
          "Failed to fund account. Please try logging in again or use another account."
        );
      }
    }

    console.log("Keyless account: ", keylessAccount.accountAddress.toString());
    setKeylessAccount(keylessAccount);
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="nes-container is-rounded shadow-md cursor-not-allowed bg-gray-200">
        <h1>Loading your blockchain account...</h1>
        <br />
        <progress
          className={`nes-progress ${hasError ? "is-error" : "is-primary"}`}
          value={progress}
          max={100}
        ></progress>
      </div>
    </div>
  );
}

export default CallbackPage;
