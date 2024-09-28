import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import fs from 'fs';

const keypairFile = fs.readFileSync('~/.config/solana/id.json');
const keypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(keypairFile.toString())));
