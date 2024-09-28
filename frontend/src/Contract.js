import React, { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";

const PROGRAM_ID = "8BDu5Liq34pREP6tzv9qj41FJKqnmaC3PynEUGQZ5WmF";

function Contract({ solana }) {
  const [counterValue, setCounterValue] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");

  useEffect(() => {
    const fetchCounterState = async () => {
      try {
        // 创建一个与 Solana 网络的连接
        const connection = new Connection("http://localhost:8899", "confirmed");

        // 创建程序的公钥
        const programId = new PublicKey(PROGRAM_ID);

        // 获取程序的帐户信息
        const accountInfo = await connection.getAccountInfo(programId);

        if (accountInfo) {
          // 获取原始的帐户数据
          const rawData = accountInfo.data;
          console.log("rawData", rawData);
          // 将字节数组转换为 Uint8Array
          const uint8Array = new Uint8Array(rawData);
          console.log("uint8Array", uint8Array);
          // 从字节数组中提取计数器值
          const counterValue = uint8Array[0];
          console.log("counterValue", counterValue);
          // 更新状态以显示计数器的值
          setCounterValue(counterValue);
        } else {
          console.log("Program account not found");
        }
      } catch (error) {
        console.error("Error fetching counter state:", error);
      }
    };

    fetchCounterState();
  }, []);

  useEffect(() => {
    const getWalletInfo = async () => {
      try {
        console.log("Wallet object:", solana);
        if (solana && solana.publicKey) {
          const walletAddress = solana.publicKey.toString();
          console.log("Wallet address:", walletAddress);

          const connection = new Connection("http://localhost:8899", "confirmed");

          const balance = await connection.getBalance(solana.publicKey);
          console.log("Wallet balance:", balance);
          const formattedBalance = (balance * 0.000000001).toFixed(3);

          const formattedAddress =
            walletAddress.slice(0, 4) + ".." + walletAddress.slice(-4);

          setWalletAddress(formattedAddress);
          setWalletBalance(formattedBalance);
        } else {
          console.log("钱包未连接");
        }
      } catch (error) {
        console.error("获取钱包信息时出错:", error);
      }
    };

    getWalletInfo();
  }, [solana]);

  return (
    <div>
      <h1>Counter State:</h1>
      {counterValue !== null ? (
        <p>Count: {counterValue}</p>
      ) : (
        <p>No counter state found in the program.</p>
      )}
      <h2>Wallet Information:</h2>
      {walletAddress ? (
        <>
          <p>Address: {walletAddress}</p>
          <p>Balance: {walletBalance} SOL</p>
        </>
      ) : (
        <p>钱包未连接</p>
      )}
    </div>
  );
}

export default Contract;