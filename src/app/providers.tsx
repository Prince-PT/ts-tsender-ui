"use client";

import { useMemo, type ReactNode } from "react";
import getConfig from "@/rainbowkitConfig";
import { WagmiProvider } from "wagmi";
import {
  RainbowKitProvider,
  ConnectButton,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";

// Create the query client once (outside of component rendering)
const queryClient = new QueryClient();

export default function Providers(props: { children: ReactNode }) {
  // Get the singleton config
  const config = getConfig();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={darkTheme()} coolMode>
          {props.children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
