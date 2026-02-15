import { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Solana 네트워크 설정 (Devnet)
const SOLANA_RPC_ENDPOINT = 'https://api.devnet.solana.com';

/**
 * Solana 지갑 연동 및 잔액 조회 Hook
 * MONOLITH Hackathon - Sol-lionaire
 * 
 * v0.2: Mock 잔액 지원 추가 (Devnet 연결 실패시 대비)
 */
export const useWalletConnection = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useMockBalance, setUseMockBalance] = useState(false);

  const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');

  /**
   * 지갑 연결 함수
   */
  const connectWallet = useCallback(async (publicKeyString, mockBalanceValue = 2.0) => {
    setIsLoading(true);
    setError(null);

    try {
      // PublicKey 객체 생성
      const publicKey = new PublicKey(publicKeyString);
      
      // 지갑 주소 저장
      setWalletAddress(publicKey.toString());
      setIsConnected(true);

      // 잔액 조회 시도
      const fetchedBalance = await fetchBalance(publicKey);

      // Devnet 연결 실패하거나 잔액이 0이면 Mock 사용
      if (fetchedBalance === 0) {
        console.log('⚠️ Devnet 잔액 0 또는 연결 실패 → Mock 잔액 사용');
        setBalance(mockBalanceValue);
        setUseMockBalance(true);
      }

      return true;
    } catch (err) {
      console.error('지갑 연결 실패:', err);
      
      // 에러 발생해도 Mock 잔액으로 진행 (개발용)
      setWalletAddress(publicKeyString);
      setBalance(mockBalanceValue);
      setIsConnected(true);
      setUseMockBalance(true);
      setError('Devnet 연결 실패 (Mock 데이터 사용 중)');
      
      return true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 잔액 조회 함수
   */
  const fetchBalance = useCallback(async (publicKey) => {
    try {
      const lamports = await connection.getBalance(publicKey);
      const solBalance = lamports / LAMPORTS_PER_SOL;
      
      if (solBalance > 0) {
        setBalance(solBalance);
        setUseMockBalance(false);
      }
      
      return solBalance;
    } catch (err) {
      console.error('잔액 조회 실패:', err);
      return 0;
    }
  }, [connection]);

  /**
   * 잔액 새로고침
   */
  const refreshBalance = useCallback(async () => {
    if (!walletAddress || useMockBalance) {
      console.log('Mock 잔액 사용 중 - 새로고침 스킵');
      return;
    }
    
    setIsLoading(true);
    try {
      const publicKey = new PublicKey(walletAddress);
      await fetchBalance(publicKey);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, useMockBalance, fetchBalance]);

  /**
   * Mock 잔액 수동 설정 (테스트용)
   */
  const setMockBalance = useCallback((amount) => {
    setBalance(amount);
    setUseMockBalance(true);
    console.log(`💰 Mock 잔액 설정: ${amount} SOL`);
  }, []);

  /**
   * 지갑 연결 해제
   */
  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setBalance(0);
    setIsConnected(false);
    setUseMockBalance(false);
    setError(null);
  }, []);

  // 자동 잔액 갱신 (30초마다) - Mock 모드에서는 비활성화
  useEffect(() => {
    if (!isConnected || !walletAddress || useMockBalance) return;

    const interval = setInterval(() => {
      refreshBalance();
    }, 30000); // 30초

    return () => clearInterval(interval);
  }, [isConnected, walletAddress, useMockBalance, refreshBalance]);

  return {
    walletAddress,
    balance,
    isConnected,
    isLoading,
    error,
    useMockBalance,
    connectWallet,
    refreshBalance,
    disconnectWallet,
    setMockBalance,
  };
};

export default useWalletConnection;
