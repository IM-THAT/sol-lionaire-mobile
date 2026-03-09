/**
 * nftService.js — Solionaire NFT Minting
 *
 * Builds a Metaplex Token Metadata NFT mint transaction using umi.
 * Returns a plain web3.js Transaction + mint Keypair so the existing
 * MWA signAndSendTransaction flow can handle the user wallet signing.
 *
 * Flow:
 *  1. Generate mint Keypair (web3.js)
 *  2. Build umi TransactionBuilder with createNft()
 *     - mint signer   : umi wrapper around our web3.js Keypair
 *     - payer/authority: createNoopSigner (user wallet handles actual signing)
 *  3. Extract umi instructions → convert each to web3.js TransactionInstruction
 *  4. Assemble web3.js Transaction
 *  5. Return { transaction, mintKeypair, mintAddress }
 *
 *  Caller passes result to signAndSendTransaction(tx, [mintKeypair]):
 *    - Inside transact: fresh blockhash → mintKeypair.partialSign → wallet signs
 */

import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createSignerFromKeypair,
  signerIdentity,
  createNoopSigner,
  percentAmount,
} from '@metaplex-foundation/umi';
import {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
  toWeb3JsInstruction,
} from '@metaplex-foundation/umi-web3js-adapters';
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

const RPC_ENDPOINT  = 'https://api.mainnet-beta.solana.com';
const NFT_BASE_URI  = 'https://solionaire.com/nft';
const SELLER_FEE_BP = 500; // 5%
const CREATOR_WALLET = 'CWPm9Uvva6ckTjwSy4L9ShDHgvr4BeEfCBZXtD1yLpjE';

/**
 * buildMintNftTransaction
 *
 * @param {object} params
 * @param {number} params.level       — 1–10
 * @param {string} params.city        — 'MANHATTAN' | 'DUBAI'
 * @param {string} params.nftName     — human-readable name (e.g. "Central Park Penthouse")
 * @param {string} params.walletAddress — payer / authority public key (base58)
 *
 * @returns {{ transaction: Transaction, mintKeypair: Keypair, mintAddress: string }}
 */
export function buildMintNftTransaction({ level, city, nftName, walletAddress }) {
  const cityKey    = city === 'MANHATTAN' ? 'ny' : 'db';
  const metaUri    = `${NFT_BASE_URI}/${cityKey}-level-${level}.json`;
  const fullName   = `Solionaire · Lv.${level} · ${nftName}`;

  // ── 1. Umi instance with Token Metadata plugin ─────────────────────────────
  const umi = createUmi(RPC_ENDPOINT).use(mplTokenMetadata());

  // ── 2. Mint keypair: web3.js Keypair → umi signer ─────────────────────────
  const mintKeypair  = Keypair.generate();
  const umiMintKp    = fromWeb3JsKeypair(mintKeypair);
  const mintSigner   = createSignerFromKeypair(umi, umiMintKp);

  // ── 3. Payer / authority: noop (user wallet signs via MWA) ────────────────
  const payerPubKey  = new PublicKey(walletAddress);
  const noopSigner   = createNoopSigner(fromWeb3JsPublicKey(payerPubKey));
  umi.use(signerIdentity(noopSigner));

  // ── 4. Build umi TransactionBuilder (no RPC call, no signing) ────────────
  const builder = createNft(umi, {
    mint:               mintSigner,
    authority:          noopSigner,
    updateAuthority:    noopSigner,
    name:               fullName,
    symbol:             'SOLI',
    uri:                metaUri,
    sellerFeeBasisPoints: percentAmount(SELLER_FEE_BP / 100, 2),
    isMutable:          true,
    isCollection:       false,
    creators: [
      {
        address:  fromWeb3JsPublicKey(new PublicKey(CREATOR_WALLET)),
        verified: false,
        share:    100,
      },
    ],
  });

  // ── 5. Extract instructions & convert to web3.js format ───────────────────
  const web3Instructions = builder.items.map(item =>
    toWeb3JsInstruction(item.instruction)
  );

  // ── 6. Assemble web3.js Transaction (feePayer / blockhash set by caller) ──
  const transaction = new Transaction();
  transaction.add(...web3Instructions);

  return {
    transaction,
    mintKeypair,
    mintAddress: mintKeypair.publicKey.toBase58(),
  };
}
