export type Altitude = 'lowland' | 'hills' | 'mountain' | 'snowline';
export type Soil = 'sand' | 'loam' | 'clay' | 'rock';
export type Humidity = 'dry' | 'moderate' | 'humid' | 'very_humid';
export type Temperature = 'cold' | 'mild' | 'warm' | 'hot';
export type Light = 'shade' | 'partial' | 'full' | 'strong';
export type WaterSource = 'rain' | 'stream' | 'spring' | 'snow';
export type Fertilizer = 'none' | 'organic' | 'phosphorus' | 'potassium' | 'boron' | 'compound';

export interface Terrace {
  id: string;
  name: string;
  unlocked: boolean;
  unlockCost: number;
  altitude: Altitude;
  soil: Soil;
  humidity: Humidity;
  temperature: Temperature;
  light: Light;
  waterSource: WaterSource;
  fertilizer: Fertilizer;
  currentVarietyId?: string;
  plantedAt?: number; // timestamp in ms
  growDurationSeconds?: number;
  status: 'empty' | 'growing' | 'ready';
  lastHarvestQuality?: number;
}

export type WalnutGrade = 'common' | 'three_ridges' | 'four_ridges' | 'five_ridges' | 'six_ridges' | 'abnormal';
export type WalnutPosture = 'standard' | 'low' | 'high' | 'abnormal';
export type WalnutPattern = 'flowing_water' | 'deep_concave' | 'fine_mesh' | 'dense_web' | 'beast_face' | 'cloud_dragon';
export type WalnutSkin = 'white_rough' | 'ginger_yellow' | 'cooked_brown' | 'oxford_red' | 'jade_glow';
export type AppraisalLevel = 'ordinary' | 'good' | 'superior' | 'precious' | 'divine';

export interface Variety {
  id: string;
  name: string;
  description: string;
  isSeasonLimited?: boolean;
  seasonName?: string;
  preferredAltitude: Altitude[];
  preferredSoil: Soil[];
  idealHumidity: Humidity;
  idealTemperature: Temperature;
  idealLight: Light;
  preferredWater: WaterSource;
  seedPrice: number;
  growTimeSeconds: number;
  contradictionDesc: string; // 内在矛盾描述（如：冷凉限制膨大）
}

export interface WalnutItem {
  id: string;
  name: string;
  varietyId: string;
  varietyName: string;
  isUncracked: boolean;
  
  // 未开时的预判
  estimatePreview?: string;
  rawSizeMm?: number;
  rawWeightG?: number;

  // 开核后的明确属性
  grade?: WalnutGrade;
  gradeName?: string;
  ridges?: number;
  edgeWidth?: number; // 边宽 mm
  bellyWidth?: number; // 肚径 mm
  height?: number; // 高度 mm
  weight?: number; // 重量 g
  posture?: WalnutPosture;
  postureName?: string;
  pattern?: WalnutPattern;
  patternName?: string;
  skinColor?: WalnutSkin;
  skinColorName?: string;
  density?: number; // 密度 1-100
  oiliness?: number; // 油性 1-100
  
  // 损耗与完整度（受工具手法影响）
  integrity?: number; // 完整度 1-100 (100为全品无损)

  // 盘玩包浆
  patinaLevel?: number; // 包浆度 0-100
  playCount?: number; // 盘玩次数

  // 鉴定
  appraisalScore?: number; // 0-100
  appraisalLevel?: AppraisalLevel;
  hasCertificate?: boolean;

  // 配对
  pairedWithId?: string;
  isPairedBox?: boolean;
  pairingScore?: number;

  estimatedValue: number;
}

export interface PairingResult {
  score: number; // 0-100
  isSuccess: boolean; // >= 85
  isPerfect: boolean; // >= 95
  dimensions: {
    size: number;
    posture: number;
    pattern: number;
    skin: number;
    ridges: number;
  };
  commentary: string;
  boxValueMultiplier: number;
}

export type AntiqueCategory = 'walnut' | 'painting' | 'sword' | 'porcelain' | 'modern';
export type AntiqueCondition = 'damaged' | 'aged' | 'intact' | 'masterpiece';

export interface AntiqueItem {
  id: string;
  name: string;
  category: AntiqueCategory;
  categoryName: string;
  rarity: 'rare' | 'epic' | 'legendary';
  era: string; // 朝代/时期
  description: string;
  story: string;
  condition: AntiqueCondition;
  unlocked: boolean;
  displayLocation?: {
    hallId: 'walnut_hall' | 'painting_hall' | 'curio_hall';
    slotIndex: number;
  };
  isTreasureOfHall?: boolean;
  maintenanceLevel: number; // 0-100
  baseValue: number;
  exchangedFrom?: string; // 哪位收藏家
}

export type CollectorId = 'old_ink' | 'sword_master' | 'porcelain_lover' | 'western_guest' | 'old_friend';

export interface CollectorExchange {
  id: string;
  collectorId: CollectorId;
  targetAntiqueId: string;
  title: string;
  reqDesc: string;
  isCompleted: boolean;
  // 判定条件
  reqMinRidges?: number;
  reqMustBePair?: boolean;
  reqMinSizeMm?: number;
  reqMinPairingScore?: number;
  reqAltitudeOrigin?: Altitude;
}

export interface CollectorLetter {
  id: string;
  collectorId: CollectorId;
  collectorName: string;
  title: string;
  type: 'narrative' | 'commission' | 'clue' | 'emotional';
  content: string;
  date: string;
  rewardClaimed: boolean;
  rewardDesc?: string;
  rewardCoins?: number;
  rewardIngots?: number;
  rewardItemId?: string;
  repliedIndex?: number;
  replyOptions?: {
    text: string;
    favorDelta: number;
    response: string;
  }[];
}

export interface Collector {
  id: CollectorId;
  name: string;
  title: string;
  avatar: string;
  obsession: string;
  preferenceDesc: string;
  favor: number;
  unlocked: boolean;
}

export interface SolarTerm {
  index: number;
  name: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  seasonName: string;
  tempDelta: number; // 档位修正 -2, -1, 0, 1, 2
  humidityDelta: number;
  lightDelta: number;
  features: string;
  limitedVarietyId?: string;
}

export type SkillBranch = 'breeding' | 'cracking' | 'appraisal' | 'restoration' | 'management';

export interface SkillNode {
  branch: SkillBranch;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  effectDesc: string;
  costPoints: number;
}

export interface SocietyTask {
  id: string;
  type: 'pair' | 'breed' | 'abnormal' | 'material' | 'visit';
  title: string;
  description: string;
  points: number;
  isGolden?: boolean;
  isUpgraded?: boolean;
  completed: boolean;
}

export interface SocietyMember {
  id: string;
  name: string;
  role: '会长' | '副会长' | '精英会员' | '普通会员';
  score: number;
  isPlayer?: boolean;
}

export interface MarketItemListing {
  id: string;
  item: WalnutItem;
  price: number;
  sellerName: string;
  isPlayer: boolean;
  listedAt: number;
}

export interface AuctionLot {
  id: string;
  walnutItem?: WalnutItem;
  antiqueItem?: AntiqueItem;
  startingPrice: number;
  currentBid: number;
  reservePrice: number; // 托底价
  highestBidder: string;
  highestBidderIsPlayer: boolean;
  secondsRemaining: number;
  status: 'preview' | 'active' | 'sold' | 'unsold';
  bidHistory: { bidder: string; amount: number; time: string }[];
}
