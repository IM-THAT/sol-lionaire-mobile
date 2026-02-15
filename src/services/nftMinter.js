/**
 * NFT Minting Service
 * Sol-lionaire v0.3
 * 
 * Compressed NFT를 사용하여 영토 소유권을 온체인에 발행
 * Metaplex Bubblegum 프로토콜 사용
 */

import { 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

/**
 * NFT Metadata 생성
 */
export const createNFTMetadata = (mappingResult) => {
  const { type, totalValue, cityType, object, property } = mappingResult;
  
  const isMicro = type === 'MICRO';
  const item = isMicro ? object : property;
  
  return {
    name: isMicro ? item.name : `${item.name} - ${item.location}`,
    symbol: 'SLNR',
    description: isMicro 
      ? `${item.description} • Worth $${totalValue.toFixed(2)}`
      : `${item.type} • Floor ${item.floor} • ${item.view}`,
    image: item.imageUrl,
    attributes: [
      { trait_type: 'City', value: cityType },
      { trait_type: 'Type', value: type },
      { trait_type: 'Value (USD)', value: totalValue.toFixed(2) },
      { trait_type: 'Rarity', value: item.rarity || 'Standard' },
      { trait_type: 'Minted At', value: new Date().toISOString() },
      ...(isMicro ? [
        { trait_type: 'Location', value: item.location },
      ] : [
        { trait_type: 'Floor', value: item.floor },
        { trait_type: 'Area (m²)', value: item.area },
        { trait_type: 'View', value: item.view },
      ]),
    ],
    properties: {
      category: 'image',
      files: [
        {
          uri: item.imageUrl,
          type: 'image/png',
        },
      ],
    },
  };
};

/**
 * NFT Minting Service
 */
class NFTMinter {
  constructor() {
    this.isMinting = false;
  }

  /**
   * cNFT 발행 (실제로는 Metaplex Bubblegum 사용)
   * 현재는 Mock 구현
   */
  async mintCompressedNFT(walletAddress, metadata, connection) {
    if (this.isMinting) {
      throw new Error('Already minting NFT');
    }

    this.isMinting = true;

    try {
      // TODO: 실제 Metaplex Bubblegum 연동
      // const merkleTree = await createTree(connection);
      // const leaf = await mintToCollectionV1(connection, {...});
      
      // Mock 구현: 0.001 SOL 전송으로 시뮬레이션
      console.log('🎨 Minting cNFT...');
      console.log('Metadata:', metadata);
      
      // 시뮬레이션: 1초 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock NFT ID 생성
      const nftId = `cnft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        nftId,
        transactionSignature: `mock_sig_${Date.now()}`,
        metadata,
        explorerUrl: `https://explorer.solana.com/address/${nftId}?cluster=devnet`,
        message: '✅ NFT 발행 완료! (Mock)',
      };
    } catch (error) {
      console.error('NFT 발행 실패:', error);
      throw error;
    } finally {
      this.isMinting = false;
    }
  }

  /**
   * 발행된 NFT 목록 조회
   */
  async getUserNFTs(walletAddress) {
    try {
      // TODO: 실제 온체인 조회
      // const nfts = await connection.getParsedTokenAccountsByOwner(...);
      
      // Mock: LocalStorage에서 조회
      const stored = localStorage.getItem(`nfts_${walletAddress}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('NFT 목록 조회 실패:', error);
      return [];
    }
  }

  /**
   * NFT를 LocalStorage에 저장 (Mock)
   */
  saveNFTLocally(walletAddress, nft) {
    try {
      const key = `nfts_${walletAddress}`;
      const existing = localStorage.getItem(key);
      const nfts = existing ? JSON.parse(existing) : [];
      
      nfts.push({
        ...nft,
        mintedAt: new Date().toISOString(),
      });
      
      localStorage.setItem(key, JSON.stringify(nfts));
      console.log('💾 NFT 저장 완료 (Local)');
    } catch (error) {
      console.error('NFT 저장 실패:', error);
    }
  }

  /**
   * 발행 비용 계산
   */
  calculateMintCost() {
    // Compressed NFT는 매우 저렴 (~$0.001)
    return {
      solAmount: 0.001,
      usdAmount: 0.15, // 임시 (SOL 가격 $150 기준)
      description: 'Compressed NFT (Bubblegum)',
    };
  }

  /**
   * NFT 발행 가능 여부 확인
   */
  canMint(balance) {
    const cost = this.calculateMintCost();
    return balance >= cost.solAmount;
  }
}

// Singleton
export const nftMinter = new NFTMinter();

export default nftMinter;
