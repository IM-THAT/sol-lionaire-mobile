import React, { createContext, useContext } from 'react';
import { useRealWalletConnection } from '../hooks/useRealWalletConnection';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const wallet = useRealWalletConnection();
  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);