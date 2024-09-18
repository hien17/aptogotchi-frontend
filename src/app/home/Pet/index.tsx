"use client";

export interface Pet {
  name: string;
  birthday: number;
  energy_points: number;
  parts: PetParts;
}

export interface PetParts {
  body: number;
  ear: number;
  face: number;
}

export const DEFAULT_PET = {
  name: "Unknown",
  energy_points: 0,
  parts: {
    body: 0,
    ear: 0,
    face: 0,
  },
};
