"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <Image
            src="/Logo.png"
            alt="T-Sender Logo"
            width={80}
            height={80}
            className="rounded-md"
          />
          <h1 className="text-xl font-bold tracking-tight">T-Sender</h1>
        </div>

        {/* Description */}
        <p className="text-m italic text-blue-500 dark:text-blue-400 hidden md:block mt-10 ml-50">
          The most efficient airdrop contract on earth, built in huff
        </p>

        {/* GitHub Link */}
        <Link
          href="https://github.com/Prince-PT"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:opacity-80 transition-opacity ml-auto mr-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </Link>

        {/* Connect Wallet Button */}
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
