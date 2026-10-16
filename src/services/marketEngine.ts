import { MarketItemListing, WalnutItem, SolarTerm } from '../types';

export interface MarketTrader {
  id: string;
  name: string;
  title: string;
  avatar: string;
  purchasePreference: string;
  priceModifier: number; // 0.85 ~ 1.35
}

export const NPC_TRADERS: MarketTrader[] = [
  {
    id: 'trader_pu',
    name: '通货刘掌柜',
    title: '普货大宗收购商',
    avatar: '👨‍💼',
    purchasePreference: '专收平原大果与普核两棱，量大从优，给现银。',
    priceModifier: 1.05
  },
  {
    id: 'trader_san',
    name: '三棱赵把头',
    title: '交易行老把式',
    avatar: '🧔',
    purchasePreference: '专收三棱与端正矮桩，在各大茶馆极好出手。',
    priceModifier: 1.15
  },
  {
    id: 'trader_yi',
    name: '异形孙猎人',
    title: '奇品搜罗客',
    avatar: '🕵️',
    purchasePreference: '专收四棱、五棱与造化异品，愿出大价钱。',
    priceModifier: 1.30
  }
];

export function generateDailyMarketListings(solarTerm: SolarTerm): MarketItemListing[] {
  // 市场 NPC 挂售的核桃（供玩家低买高卖或赌生核）
  const listings: MarketItemListing[] = [
    {
      id: 'mkt_npc_1',
      sellerName: '山民老根',
      isPlayer: false,
      price: 120,
      listedAt: Date.now(),
      item: {
        id: 'wn_npc_mkt_1',
        name: '未开青皮 · 溪畔细纹',
        varietyId: 'stream_fine',
        varietyName: '溪畔细纹',
        isUncracked: true,
        rawSizeMm: 41.5,
        rawWeightG: 23.8,
        estimatePreview: '刚从溪边老树摘下，外皮水灵，似有好纹。',
        estimatedValue: 120
      }
    },
    {
      id: 'mkt_npc_2',
      sellerName: '走方郎中',
      isPlayer: false,
      price: 280,
      listedAt: Date.now(),
      item: {
        id: 'wn_npc_mkt_2',
        name: '未开青皮 · 高山厚皮',
        varietyId: 'mountain_thick',
        varietyName: '高山厚皮',
        isUncracked: true,
        rawSizeMm: 42.8,
        rawWeightG: 28.5,
        estimatePreview: '悬崖峭壁所采，分量极沉，值得一开！',
        estimatedValue: 280
      }
    },
    {
      id: 'mkt_npc_3',
      sellerName: '通货刘掌柜',
      isPlayer: false,
      price: 360,
      listedAt: Date.now(),
      item: {
        id: 'wn_npc_mkt_3',
        name: '良品·三棱 · 溪畔细纹',
        varietyId: 'stream_fine',
        varietyName: '溪畔细纹',
        isUncracked: false,
        grade: 'three_ridges',
        gradeName: '良品 · 三棱',
        ridges: 3,
        edgeWidth: 41.8,
        bellyWidth: 40.2,
        height: 38.6,
        weight: 24.1,
        posture: 'standard',
        postureName: '正桩 · 端庄中正',
        pattern: 'flowing_water',
        patternName: '流水纹 · 舒展绵延',
        skinColor: 'ginger_yellow',
        skinColorName: '姜黄 · 骨质初显',
        integrity: 95,
        patinaLevel: 10,
        appraisalScore: 78,
        appraisalLevel: 'superior',
        estimatedValue: 360
      }
    }
  ];

  // 节气限定加成
  if (solarTerm.limitedVarietyId === 'dew_giant') {
    listings.push({
      id: 'mkt_npc_dew',
      sellerName: '白露客商',
      isPlayer: false,
      price: 450,
      listedAt: Date.now(),
      item: {
        id: 'wn_npc_mkt_dew',
        name: '未开青皮 · 白露大果',
        varietyId: 'dew_giant',
        varietyName: '白露大果',
        isUncracked: true,
        rawSizeMm: 47.5,
        rawWeightG: 34.0,
        estimatePreview: '白露节气特供霸王果，个头极大！',
        estimatedValue: 450
      }
    });
  }

  return listings;
}
