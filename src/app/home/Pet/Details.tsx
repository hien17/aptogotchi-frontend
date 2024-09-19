"use client";

import { AiFillSave } from "react-icons/ai";
import { FaCopy, FaExternalLinkAlt } from "react-icons/fa";
import { HealthBar } from "@/components/HealthBar";
import { useState } from "react";
import { NEXT_PUBLIC_CONTRACT_ADDRESS } from "@/utils/env";
import { getAptosClient } from "@/utils/aptosClient";
import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { toast } from "sonner";
import { usePet } from "@/context/PetContext";

const aptosClient = getAptosClient();

export function Details() {
  const { pet, setPet } = usePet();
  const { keylessAccount } = useKeylessAccount();

  const [newName, setNewName] = useState<string>(pet?.name || "");
  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);

  const owner = keylessAccount?.accountAddress.toString() || "";

  const handleNameChange = async () => {
    if (!keylessAccount) return;

    setTransactionInProgress(true);

    const transaction = await aptosClient.transaction.build.simple({
      sender: keylessAccount.accountAddress,
      data: {
        function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::set_name`,
        typeArguments: [],
        functionArguments: [newName],
      },
    });

    try {
      const committedTxn = await aptosClient.signAndSubmitTransaction({
        signer: keylessAccount,
        transaction,
      });
      await aptosClient.waitForTransaction({
        transactionHash: committedTxn.hash,
      });
      toast.success(
        `Successfully renamed your pet from ${pet?.name} to ${newName}!`,
        {
          action: {
            label: "Explorer",
            onClick: () =>
              window.open(
                `https://explorer.aptoslabs.com/txn/${committedTxn.hash}?network=testnet`,
                "_blank"
              ),
          },
        }
      );

      setPet((pet) => {
        if (!pet) return pet;
        return { ...pet, name: newName };
      });
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to rename your pet. Please try again.");
    } finally {
      setTransactionInProgress(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(owner);
    toast.success("Owner address copied to clipboard!");
  };

  const nameField = (
    <div className="nes-field">
      <label htmlFor="name_field">
        {transactionInProgress ? "Loading..." : "Name"}
      </label>
      <div className="relative mt-4">
        <input
          type="text"
          id="name_field"
          className="nes-input pr-14"
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
        />
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 nes-pointer disabled:cursor-not-allowed text-sky-500 disabled:text-gray-400"
          disabled={newName === pet?.name || transactionInProgress}
          onClick={handleNameChange}
        >
          <AiFillSave className="h-8 w-8 drop-shadow-sm" />
        </button>
      </div>
    </div>
  );

  const ownerField = (
    <div className="nes-field">
      <a
        className="flex items-center gap-2"
        href={`https://explorer.aptoslabs.com/account/${owner}?network=testnet`}
        target="_blank"
      >
        <label htmlFor="owner_field" className="mb-0">
          Owner
        </label>
        <FaExternalLinkAlt className="h-4 w-4 drop-shadow-sm" />
      </a>
      <div className="relative mt-4">
        <input
          type="text"
          id="owner_field"
          className="nes-input pr-14"
          disabled
          value={owner}
        />
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 nes-pointer disabled:cursor-not-allowed text-gray-400 disabled:text-gray-400"
          disabled={!owner}
          onClick={handleCopy}
        >
          <FaCopy className="h-8 w-8 drop-shadow-sm" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <label>Energy Points</label>
        <HealthBar
          totalHealth={10}
          currentHealth={pet?.energy_points || 0}
          icon="star"
        />
      </div>
      <div className="flex flex-col gap-2">
        {nameField}
        {ownerField}
      </div>
    </div>
  );
}
