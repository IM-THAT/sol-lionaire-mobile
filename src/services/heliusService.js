/**
 * heliusService.js
 * Fetches on-chain Solionaire territory claims via Helius API.
 *
 * Each claim is a Memo Program transaction with JSON:
 *   { app: "Solionaire", level: N, name: "...", city: "...", ts: N }
 *
 * We query recent transactions on the Memo Program, parse the memo,
 * filter by app:"Solionaire", and return per-tier leaderboards.
 */

const MEMO_PROGRAM = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
const HELIUS_API_KEY = process.env.EXPO_PUBLIC_HELIUS_API_KEY;
const HELIUS_BASE = `https://api.helius.xyz/v0/addresses/${MEMO_PROGRAM}/transactions?api-key=${HELIUS_API_KEY}&limit=100`;

// Tier boundaries
const getTierGroup = (level) => {
  if (level >= 8) return 'high_table';
  if (level >= 4) return 'avenue';
  if (level >= 1) return 'plaza';
  return null;
};

// Shorten wallet address: "8xKj...mN2"
export const shortAddr = (addr) => {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 4)}...${addr.slice(-3)}`;
};

// ─── Base58 decoder ──────────────────────────────────────────────────────────
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Decode a base58 string to a UTF-8 string.
 * Helius returns Memo instruction data as base58-encoded bytes.
 * Returns null on failure.
 */
function decodeBase58(str) {
  try {
    let num = 0n;
    for (const char of str) {
      const idx = B58.indexOf(char);
      if (idx < 0) return null;
      num = num * 58n + BigInt(idx);
    }
    const hex = num.toString(16);
    const padded = hex.length % 2 ? '0' + hex : hex;
    const bytes = padded.match(/.{2}/g).map(h => parseInt(h, 16));
    // Prepend zero bytes for leading '1's in base58
    let leadingZeros = 0;
    for (const c of str) { if (c === '1') leadingZeros++; else break; }
    const all = [...Array(leadingZeros).fill(0), ...bytes];
    return new TextDecoder('utf-8').decode(new Uint8Array(all));
  } catch {
    return null;
  }
}

// ─── Memo extraction ─────────────────────────────────────────────────────────
/**
 * Extract memo text from a Helius enhanced transaction.
 * Strategy 1: decode base58 instruction data.
 * Strategy 2: parse from transaction log messages.
 */
function extractMemo(tx) {
  // 1. Instruction data (base58 → UTF-8)
  const memoIx = tx.instructions?.find(ix => ix.programId === MEMO_PROGRAM);
  if (memoIx?.data) {
    const decoded = decodeBase58(memoIx.data);
    if (decoded) return decoded;
  }

  // 2. Log messages: "Program log: Memo (len N): \"...\""
  const logs = tx.meta?.logMessages || tx.logs || [];
  for (const log of logs) {
    const match = log.match(/Program log: Memo \(len \d+\): "(.+)"/s);
    if (match) return match[1];
  }

  return null;
}

// ─── Parse one transaction into a claim object ───────────────────────────────
function parseClaim(tx) {
  try {
    const memoStr = extractMemo(tx);
    if (!memoStr) return null;
    if (!memoStr.includes('Solionaire')) return null;

    const parsed = JSON.parse(memoStr);
    if (parsed.app !== 'Solionaire') return null;

    const wallet = tx.feePayer;
    const tierGroup = getTierGroup(parsed.level);
    if (!wallet || !tierGroup) return null;

    return {
      wallet,
      level: parsed.level,
      name: parsed.name || '',
      city: parsed.city || '',
      ts: parsed.ts || 0,
      tierGroup,
    };
  } catch {
    return null;
  }
}

// ─── Fetch page of transactions ───────────────────────────────────────────────
async function fetchPage(before) {
  const url = before ? `${HELIUS_BASE}&before=${before}` : HELIUS_BASE;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Helius error: ${res.status}`);
  return res.json();
}

/**
 * Fetch leaderboard data from Helius.
 * Scans up to 3 pages (300 txs) to find Solionaire claims.
 * Returns { plaza: [], avenue: [], high_table: [] }
 * Each entry: { wallet, level, name, city, ts }
 */
export async function fetchLeaderboard() {
  try {
    const claims = [];
    let before = undefined;
    const MAX_PAGES = 3;

    for (let page = 0; page < MAX_PAGES; page++) {
      const txs = await fetchPage(before);
      if (!txs || txs.length === 0) break;

      for (const tx of txs) {
        const claim = parseClaim(tx);
        if (claim) claims.push(claim);
      }

      // Pagination: use signature of last tx as cursor
      const last = txs[txs.length - 1];
      before = last?.signature;
      if (!before || txs.length < 100) break;
    }

    // Deduplicate: keep highest level per wallet
    const best = {};
    for (const c of claims) {
      if (!best[c.wallet] || c.level > best[c.wallet].level) {
        best[c.wallet] = c;
      }
    }

    // Group by tier and sort by level desc, then ts desc
    const result = { plaza: [], avenue: [], high_table: [] };
    for (const entry of Object.values(best)) {
      result[entry.tierGroup].push(entry);
    }
    for (const key of Object.keys(result)) {
      result[key].sort((a, b) => b.level - a.level || b.ts - a.ts);
    }

    return result;
  } catch (e) {
    console.error('[heliusService] fetchLeaderboard failed:', e);
    return { plaza: [], avenue: [], high_table: [] };
  }
}

/**
 * Fetch the most recent Solionaire claim for a specific wallet.
 * Used to confirm a user's own claim is on-chain.
 * Returns the claim object or null.
 */
export async function fetchMyClaim(walletAddress) {
  if (!walletAddress) return null;
  try {
    const url = `https://api.helius.xyz/v0/addresses/${walletAddress}/transactions?api-key=${HELIUS_API_KEY}&limit=50`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const txs = await res.json();

    for (const tx of txs) {
      // Only look at txs that used the Memo Program
      const hasMemo = tx.instructions?.some(ix => ix.programId === MEMO_PROGRAM);
      if (!hasMemo) continue;
      const claim = parseClaim(tx);
      if (claim) return claim;
    }
    return null;
  } catch {
    return null;
  }
}
