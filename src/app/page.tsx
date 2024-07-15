"use client";
import Image from "next/image";
import thirdwebIcon from "@public/thirdweb.svg";
import { client } from "./client";
import { getContract, Hex, prepareTransaction, toWei } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { claimTo } from "thirdweb/extensions/erc721";
import {
  ConnectButton,
  TransactionButton,
  useActiveAccount,
  useSendTransaction,
} from "thirdweb/react";
import React, { useState } from "react";

export default function Home() {
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <Header />

        <div className="flex justify-center mb-20">
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Example App",
              url: "https://example.com",
            }}
          />
        </div>

        <ThirdwebPayExample />
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <Image
        src={thirdwebIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />

      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        thirdweb SDK
        <span className="text-zinc-300 inline-block mx-1"> + </span>
        <span className="inline-block -skew-x-6 text-blue-500"> Next.js </span>
      </h1>

      <p className="text-zinc-300 text-base">
        Read the{" "}
        <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">
          README.md
        </code>{" "}
        file to get started.
      </p>
    </header>
  );
}

function ThirdwebPayExample() {
  const [isLoading, setIsLoading] = useState(false);
  const address = useActiveAccount()?.address;
  const { mutate: sendTx, data: transactionResult } = useSendTransaction({
    // customisations
    payModal: {
      buyWithCrypto: false,
      // buyWithFiat: false,
    },
  });
  const contract = getContract({
    // the client you have created via `createThirdwebClient()`
    client,
    // the chain the contract is deployed on
    chain: defineChain(CHAIN_ID_FOR_THE_TRANSACTION),
    // the contract's address
    address: "CONTRACT_TO_MAKE_THE_TRANSACTION_ON",
  });
  const transaction = claimTo({
    contract,
    to: address as Hex,
    quantity: 1n,
  });
  return (
    <div className="pb-10 flex items-center justify-center container max-w-screen-lg mx-auto">
      <TransactionButton
        payModal={{
          buyWithCrypto: false,
        }}
        transaction={() => {
          // Create a transaction object and return it

          return transaction;
        }}
      >
        MINT PAY TRANSACTION (Transaction Button)
      </TransactionButton>
      <button
        className="bg-white m-2 text-black p-4"
        onClick={async (e) => {
          setIsLoading(true);
          sendTx(transaction);
        }}
      >
        {isLoading
          ? "Loading..."
          : "MINT PAY TRANSACTION (useSendTransaction Hook)"}
      </button>

      <TransactionButton
        payModal={{
          buyWithCrypto: false,
        }}
        transaction={() => {
          // Create a transaction object and return it
          const transaction = prepareTransaction({
            // The account that will be the receiver
            to: "WALLET_TO_TRANSFER_FUNDS",
            // The value is the amount of ether you want to send with the transaction
            value: toWei("AMOUNT_TO_TRANSFER"),
            // The chain to execute the transaction on
            chain: defineChain(CHAIN_ID_FOR_THE_TRANSACTION),
            // Your thirdweb client
            client,
          });
          return transaction;
        }}
      >
        Transfer Funds Button
      </TransactionButton>
    </div>
  );
}
