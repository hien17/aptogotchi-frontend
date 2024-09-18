import type { Metadata } from "next";
import localFont from "next/font/local";
import { PropsWithChildren } from "react";
import { GeoTargetly } from "@/utils/GeoTargetly";
import { PetProvider } from "@/context/PetContext";
import { KeylessAccountProvider } from "@/context/KeylessAccountContext";
import { Toaster } from "sonner";
import "nes.css/css/nes.min.css";
import "./globals.css";

const kongtext = localFont({
  src: "./../../public/kongtext.ttf",
  variable: "--font-kongtext",
});

export const metadata: Metadata = {
  title: "Aptogotchi",
  description: "Aptogotchi - Your new favorite on-chain pet!",
  openGraph: {
    title: "Aptogotchi",
    description: "Aptogotchi - Your new favorite on-chain pet!",
    images: ["/aptogotchi.png"],
  },
  twitter: {
    card: "summary",
    site: "@Aptos_Network",
    title: "Aptogotchi",
    description: "Aptogotchi - Your new favorite on-chain pet!",
    images: ["/aptogotchi.png"],
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="Rnm3DL87HNmPncIFwBLXPhy-WGFDXIyplSL4fRtnFsA"
        />
      </head>
      <body className={kongtext.className}>
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              letterSpacing: "0.02em",
            },
            className: "toast",
            duration: 5000,
          }}
          closeButton
          expand={true}
        />
        <PetProvider>
          <KeylessAccountProvider>{children}</KeylessAccountProvider>
        </PetProvider>
        <GeoTargetly />
      </body>
    </html>
  );
}
