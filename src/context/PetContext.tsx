<<<<<<< Updated upstream
"use client";

import { Pet } from "@/app/home/Pet";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

interface PetContextType {
  pet: Pet | undefined;
  setPet: Dispatch<SetStateAction<Pet | undefined>>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pet, setPet] = React.useState<Pet | undefined>(undefined);

  return (
    <PetContext.Provider value={{ pet, setPet }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => {
  const context = useContext(PetContext);

  if (!context) {
    throw new Error("usePet must be used within a PetProvider");
  }

  return context;
=======
export const PetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div>PetProvider</div>;
>>>>>>> Stashed changes
};
