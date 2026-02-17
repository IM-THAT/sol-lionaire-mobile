import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { useState, useCallback } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { Platform } from 'react-native';

const SOLANA_RPC = 'https://api.devnet.solana.com';
const APP_IDENTITY = {
  name: 'Sol-lionaire',
  uri: 'https://sol-lionaire.app',
  icon: 'assets/icon.png',
};

const base64ToPublicKey = (base64Str) => {
  const bytes = Buffer.from(base64Str, 'base64');
  return new PublicKey(bytes);
};

export const useRealWalletConnection = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance]             = useState(0);
  const [isConnected, setIsConnected]     = useState(false);
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState(null);
  const [walletName, setWalletName]       = useState(null);
  const [authToken, setAuthToken]         = useState(null);

  const connection = new Connection(SOLANA_RPC, 'confirmed');

  const fetchBalance = async (pubkeyStr) => {
    try {
      const lamports = await connection.getBalance(new PublicKey(pubkeyStr));
      return lamports / LAMPORTS_PER_SOL;
    } catch (e) {
      console.error('Balance fetch failed:', e);
      return 0;
    }
  };

  // walletId: 'phantom' | 'seedvault'
  const connectWallet = useCallback(async (walletId = 'phantom') => {
    setIsLoading(true);
    setError(null);

    try {
      if (Platform.OS === 'android') {
        console.log(`📱 Connecting via MWA: ${walletId}`);

        const { publicKey, authToken: token } = await transact(async (wallet) => {
          const authResult = await wallet.authorize({
            cluster: 'devnet',
            identity: APP_IDENTITY,
          });
          return {
            publicKey: authResult.accounts[0].address,
            authToken: authResult.auth_token,
          };
        });

        const pubkey = base64ToPublicKey(publicKey);
        const pubkeyStr = pubkey.toBase58();
        console.log('✅ Connected (base58):', pubkeyStr);

        const sol = await fetchBalance(pubkeyStr);

        setWalletAddress(pubkeyStr);
        setBalance(sol);
        setIsConnected(true);
        setWalletName(walletId === 'phantom' ? '👻 Phantom' : '🔐 Seed Vault');
        setAuthToken(token);

        return { publicKey: pubkeyStr, balance: sol };

      } else {
        // Web fallback
        const mockKey = '7gh5fZGdnGQWLajuGj8u4rEPNZrVjtxPbCXNHDzkQ5LX';
        setWalletAddress(mockKey);
        setBalance(2.0);
        setIsConnected(true);
        setWalletName('Test Wallet');
        return { publicKey: mockKey, balance: 2.0 };
      }
    } catch (err) {
      console.error('❌ Wallet connection failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      if (Platform.OS === 'android' && authToken) {
        await transact(async (wallet) => {
          await wallet.deauthorize({ auth_token: authToken });
        });
      }
    } catch (e) {
      console.log('Deauthorize failed:', e);
    } finally {
      setWalletAddress(null);
      setBalance(0);
      setIsConnected(false);
      setWalletName(null);
      setAuthToken(null);
      setError(null);
    }
  }, [authToken]);

  const refreshBalance = useCallback(async () => {
    if (!walletAddress) return;
    const sol = await fetchBalance(walletAddress);
    setBalance(sol);
  }, [walletAddress]);

  return {
    walletAddress, balance, isConnected, isLoading,
    error, walletName, connectWallet, disconnectWallet, refreshBalance,
  };
};

export default useRealWalletConnection;
