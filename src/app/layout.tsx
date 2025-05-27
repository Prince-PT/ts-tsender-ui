import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import Providers from "@/app/providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "T-Sender",
  description: "An app to send airdrops to any address",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main>
            {props.children}{/* All website code will be here => all the page pass through this */}
          </main>
        </Providers>
      </body>
    </html>
  );
}
