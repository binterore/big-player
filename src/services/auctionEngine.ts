import { AuctionLot, WalnutItem, AntiqueItem } from '../types';

export interface AuctionNpc {
  id: string;
  name: string;
  avatar: string;
  budget: number;
  preferenceCategory: string;
  style: 'aggressive' | 'cautious' | 'sniper';
  personalityQuote: string;
}

export const AUCTION_NPCS: AuctionNpc[] = [
  {
    id: 'npc_ink',
    name: '老砚台',
    avatar: '🖋️',
    budget: 6500,
    preferenceCategory: 'four_ridges',
    style: 'cautious',
    personalityQuote: '四棱方正方合大道，老朽出此价，谁人相争？'
  },
  {
    id: 'npc_sword',
    name: '铸剑翁',
    avatar: '🗡️',
    budget: 12000,
    preferenceCategory: 'five_ridges',
    style: 'aggressive',
    personalityQuote: '此等高山风骨，正配我鞘中三尺青锋！加价！'
  },
  {
    id: 'npc_porcelain',
    name: '瓷痴',
    avatar: '🏺',
    budget: 15000,
    preferenceCategory: 'paired',
    style: 'aggressive',
    personalityQuote: '天下成双成对之至宝，断不能落于俗人之手！'
  },
  {
    id: 'npc_western',
    name: '西洋客',
    avatar: '🧭',
    budget: 20000,
    preferenceCategory: 'big_or_abnormal',
    style: 'sniper',
    personalityQuote: '哈哈！奇特壮丽，我的东方展厅非它莫属！'
  },
  {
    id: 'npc_collector_zhao',
    name: '赵员外',
    avatar: '🎩',
    budget: 4500,
    preferenceCategory: 'general',
    style: 'cautious',
    personalityQuote: '老夫买来玩玩，多出一分便不要了。'
  }
];

export function createAuctionLot(
  item: WalnutItem | AntiqueItem,
  isWalnut: boolean,
  reservePrice: number
): AuctionLot {
  const baseVal = isWalnut
    ? (item as WalnutItem).estimatedValue || 200
    : (item as AntiqueItem).baseValue || 5000;

  const startingPrice = Math.max(100, Math.round(baseVal * 0.6));

  return {
    id: 'lot_' + Date.now(),
    walnutItem: isWalnut ? (item as WalnutItem) : undefined,
    antiqueItem: !isWalnut ? (item as AntiqueItem) : undefined,
    startingPrice,
    currentBid: startingPrice,
    reservePrice,
    highestBidder: '起拍底价',
    highestBidderIsPlayer: false,
    secondsRemaining: 45,
    status: 'active',
    bidHistory: [
      {
        bidder: '拍卖司仪',
        amount: startingPrice,
        time: '开拍'
      }
    ]
  };
}

export function simulateNpcBiddingStep(
  lot: AuctionLot,
  playerPlacedBidRecently: boolean = false
): { updatedLot: AuctionLot; bidPlaced: boolean; announcement?: string } {
  if (lot.status !== 'active' || lot.secondsRemaining <= 0) {
    return { updatedLot: lot, bidPlaced: false };
  }

  // 筛选感兴趣的 NPC
  const availableNpcs = AUCTION_NPCS.filter(npc => {
    // 预算是否支持
    if (npc.budget <= lot.currentBid) return false;
    // 偏好匹配
    if (lot.walnutItem) {
      const w = lot.walnutItem;
      if (npc.preferenceCategory === 'four_ridges' && (w.ridges || 2) >= 4) return true;
      if (npc.preferenceCategory === 'five_ridges' && (w.ridges || 2) >= 5) return true;
      if (npc.preferenceCategory === 'paired' && (w.isPairedBox || (w.pairingScore || 0) >= 85)) return true;
      if (npc.preferenceCategory === 'big_or_abnormal' && ((w.edgeWidth || 0) >= 45 || w.grade === 'abnormal')) return true;
      if (npc.preferenceCategory === 'general') return Math.random() < 0.4;
    }
    return Math.random() < 0.3;
  });

  if (availableNpcs.length === 0) {
    return { updatedLot: lot, bidPlaced: false };
  }

  // 根据 NPC 风格决定本次是否出价
  const chosenNpc = availableNpcs[Math.floor(Math.random() * availableNpcs.length)];

  // sniper 在最后10秒出价更激进
  if (chosenNpc.style === 'sniper' && lot.secondsRemaining > 15 && Math.random() < 0.8) {
    return { updatedLot: lot, bidPlaced: false };
  }

  // 计算加价幅度 (5% ~ 15%)
  const minIncrement = Math.max(50, Math.round(lot.currentBid * 0.08));
  const newBid = lot.currentBid + minIncrement;

  if (newBid > chosenNpc.budget) {
    return { updatedLot: lot, bidPlaced: false };
  }

  const updatedLot: AuctionLot = {
    ...lot,
    currentBid: newBid,
    highestBidder: chosenNpc.name,
    highestBidderIsPlayer: false,
    bidHistory: [
      {
        bidder: chosenNpc.name,
        amount: newBid,
        time: `${lot.secondsRemaining}秒`
      },
      ...lot.bidHistory.slice(0, 7)
    ]
  };

  return {
    updatedLot,
    bidPlaced: true,
    announcement: `${chosenNpc.avatar} ${chosenNpc.name} 举牌！出价 ${newBid} 文：“${chosenNpc.personalityQuote}”`
  };
}
