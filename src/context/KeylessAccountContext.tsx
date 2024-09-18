"use client";

<<<<<<< Updated upstream
import { Account } from "@aptos-labs/ts-sdk";
import React, { createContext, useContext, useState } from "react";
=======
import React, { createContext, useContext } from "react";
import { Account } from "@aptos-labs/ts-sdk";
>>>>>>> Stashed changes

interface KeylessAccountContextType {
  keylessAccount: Account | null;
  setKeylessAccount: (account: Account | null) => void;
}

const KeylessAccountContext = createContext<
  KeylessAccountContextType | undefined
>(undefined);

export const KeylessAccountProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
<<<<<<< Updated upstream
  const [keylessAccount, setKeylessAccount] = useState<Account | null>(null);

  return (
    <KeylessAccountContext.Provider
      value={{ keylessAccount, setKeylessAccount }}
    >
      {children}
    </KeylessAccountContext.Provider>
  );
=======
  return <div>zzz</div>;
>>>>>>> Stashed changes
};

export const useKeylessAccount = () => {
  const context = useContext(KeylessAccountContext);
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
  if (!context) {
    throw new Error(
      "useKeylessAccount must be used within a KeylessAccountProvider"
    );
  }
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
  return context;
};
