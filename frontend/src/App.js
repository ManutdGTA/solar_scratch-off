import "./App.css";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
  TransactionInstruction,
  Keypair,
} from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import Card2 from "./Card2";
import Contract from "./Contract";

import * as borsh from "borsh";

const PROGRAM_ID = "8BDu5Liq34pREP6tzv9qj41FJKqnmaC3PynEUGQZ5WmF";

class RandomNumber {
  constructor(properties) {
    Object.assign(this, properties);
  }

  static schema = new Map([
    [RandomNumber, { kind: "struct", fields: [["number", "u32"]] }],
  ]);
}

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [randomNumber, setRandomNumber] = useState(null);
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const getWalletInfo = async (solana, onlyIfTrusted = false) => {
    try {
      const response = await solana.connect({ onlyIfTrusted });
      const walletAddress = response.publicKey.toString();

      // const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const connection = new Connection("http://localhost:8899", "confirmed");

      const balance = await connection.getBalance(response.publicKey);
      const formattedBalance = (balance * 0.000000001).toFixed(3);

      const formattedAddress =
        walletAddress.slice(0, 4) + ".." + walletAddress.slice(-4);

      setWalletAddress(formattedAddress);
      setWalletBalance(formattedBalance);
    } catch (error) {
      console.error("获取钱包信息时出错:", error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        await getWalletInfo(solana, true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      await getWalletInfo(solana);
    }
  };

  const disconnectWallet = async () => {
    const { solana } = window;
    if (solana) {
      await solana.disconnect();
      setWalletAddress(null);
    }
  };

  useEffect(() => {
    fetchRandomNumber();
  }, []);

  async function fetchRandomNumber() {
    try {
      const { solana } = window;
      if (!solana) return;

      const connection = new Connection("http://localhost:8899", "confirmed");

      const program = new PublicKey(PROGRAM_ID);
      const randomNumberAccount = new Keypair();

      const instruction = new TransactionInstruction({
        keys: [
          {
            pubkey: randomNumberAccount.publicKey,
            isSigner: false,
            isWritable: true,
          },
        ],
        programId: program,
        data: Buffer.alloc(0),
      });

      const transaction = new Transaction().add(instruction);
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = solana.publicKey;

      const signed = await solana.signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(txid);

      const randomNumberData = await connection.getAccountInfo(
        randomNumberAccount.publicKey
      );
      if (randomNumberData) {
        const randomNumberStruct = borsh.deserialize(
          RandomNumber.schema,
          RandomNumber,
          randomNumberData.data
        );
        setRandomNumber(randomNumberStruct.number);
      }
    } catch (error) {
      console.error("Error fetching random number:", error);
    }
  }

  return (
    <div className="App">
      <Card />
      <br />
      {/* <Contract /> */}
      {/* <Card2 width={240} height={600} revealImage="./bottom_card.jpg" /> */}
      {!walletAddress && (
        <button onClick={connectWallet}>Connect to Wallet</button>
      )}
      {walletAddress && (
        <>
          <p>Connected with: {walletAddress}</p>
          <p>SOL Balance: {walletBalance}</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </>
      )}
      {/* <div>
        <p>Random Number: {randomNumber}</p>
        <button onClick={fetchRandomNumber}>Generate New Random Number</button>
      </div> */}
    </div>
  );
}

export default App;
