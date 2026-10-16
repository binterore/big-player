import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Terrace,
  WalnutItem,
  AntiqueItem,
  Collector,
  CollectorExchange,
  CollectorLetter,
  SolarTerm,
  SkillNode,
  SocietyTask,
  SocietyMember,
  MarketItemListing,
  AuctionLot,
  Altitude,
  Soil,
  Humidity,
  Temperature,
  Light,
  WaterSource,
  Fertilizer,
  SkillBranch
} from '../types';
import { INITIAL_TERRACES } from '../config/terracesData';
import { SOLAR_TERMS } from '../config/solarTermsData';
import { ANTIQUES_DATA, ANTIQUES_MAP } from '../config/antiquesData';
import { COLLECTORS, INITIAL_EXCHANGES, INITIAL_LETTERS } from '../config/collectorsData';
import { INITIAL_SKILLS } from '../config/skillsData';
import { VARIETIES_MAP } from '../config/varietiesData';
import { evaluateTerraceClimate } from '../services/climateEngine';
import { generateRawWalnut, crackWalnut, CrackingTool } from '../services/walnutGenerator';
import { calculatePairing } from '../services/pairingEngine';
import { generateDailyMarketListings, NPC_TRADERS } from '../services/marketEngine';
import { createAuctionLot, simulateNpcBiddingStep } from '../services/auctionEngine';
import { soundManager } from '../utils/audio';

const STORAGE_KEY = 'big_player_game_save_v1';

export interface GameState {
  coins: number;
  ingots: number;
  skillPoints: number;
  societyCoins: number;
  day: number;
  solarTermIndex: number;
  solarProgress: number; // 0 - 100
  terraces: Terrace[];
  walnuts: WalnutItem[];
  antiques: AntiqueItem[];
  collectors: Collector[];
  exchanges: CollectorExchange[];
  letters: CollectorLetter[];
  skills: SkillNode[];
  seeds: Record<string, number>;
  societyTasks: SocietyTask[];
  societyMembers: SocietyMember[];
  marketListings: MarketItemListing[];
  activeAuctionLot: AuctionLot | null;
  toastMessage: string | null;
}

interface GameContextType extends GameState {
  showToast: (msg: string) => void;
  // 台地管理
  unlockTerrace: (id: string) => void;
  updateTerraceCondition: (
    id: string,
    conditions: Partial<{
      altitude: Altitude;
      soil: Soil;
      humidity: Humidity;
      temperature: Temperature;
      light: Light;
      waterSource: WaterSource;
      fertilizer: Fertilizer;
    }>
  ) => void;
  plantTerrace: (terraceId: string, varietyId: string) => void;
  harvestTerrace: (terraceId: string) => void;
  speedUpTerrace: (terraceId: string) => void;

  // 开核与鉴定
  crackWalnutById: (walnutId: string, tool: CrackingTool) => WalnutItem | null;
  appraiseWalnutById: (walnutId: string) => void;
  pairWalnutsById: (w1Id: string, w2Id: string) => boolean;
  playWithWalnut: (walnutId: string) => void;
  sellWalnutDirect: (walnutId: string, traderId?: string) => void;

  // 藏品与展馆
  maintainAntiqueById: (antiqueId: string) => void;
  assignAntiqueToHall: (antiqueId: string, hallId: 'walnut_hall' | 'painting_hall' | 'curio_hall', slotIndex: number, isTreasure?: boolean) => void;
  removeAntiqueFromHall: (antiqueId: string) => void;

  // 收藏家与传书
  submitExchange: (exchangeId: string, walnutIds: string[]) => boolean;
  replyLetter: (letterId: string, optionIndex: number) => void;
  claimLetterReward: (letterId: string) => void;

  // 交易与拍卖
  buySeed: (varietyId: string, count?: number) => void;
  buyMarketItem: (listingId: string) => void;
  startAuctionLot: (itemId: string, isWalnut: boolean, reservePrice: number) => void;
  playerBidOnAuction: () => void;
  claimAuctionProceeds: () => void;

  // 技艺加点
  upgradeSkillNode: (branch: SkillBranch) => void;

  // 协会竞赛
  claimSocietyTask: (taskId: string) => void;
  upgradeSocietyTask: (taskId: string) => void;

  // 时间推进
  advanceSolarTerm: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 初始状态
  const loadInitialState = (): GameState => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          toastMessage: null,
          activeAuctionLot: null // 拍卖不跨会话残留
        };
      }
    } catch (e) {
      console.warn('Failed to load save, using defaults', e);
    }

    return {
      coins: 500,
      ingots: 100,
      skillPoints: 10,
      societyCoins: 50,
      day: 1,
      solarTermIndex: 0,
      solarProgress: 0,
      terraces: INITIAL_TERRACES,
      walnuts: [],
      antiques: ANTIQUES_DATA,
      collectors: COLLECTORS,
      exchanges: INITIAL_EXCHANGES,
      letters: INITIAL_LETTERS,
      skills: INITIAL_SKILLS,
      seeds: {
        plain_big: 4,
        mountain_thick: 1
      },
      societyTasks: [
        { id: 'st_1', type: 'pair', title: '【王牌】配对委托', description: '向协会上交一对配对度 ≥ 85% 的精品核桃', points: 30, completed: false },
        { id: 'st_2', type: 'breed', title: '【主力】培育高山厚皮', description: '在高山或岩土台地采收 2 颗成熟果实', points: 20, completed: false },
        { id: 'st_3', type: 'abnormal', title: '【考验】异形开核', description: '开出任意 1 颗三棱或四棱文玩核桃', points: 18, completed: false },
        { id: 'st_4', type: 'material', title: '【库存】提交核桃原料', description: '上交 3 颗两棱普核作为会所雕刻原料', points: 10, completed: false },
        { id: 'st_5', type: 'visit', title: '【鉴赏】拜访名家展馆', description: '于私人博物馆中鉴赏擦拭藏品 1 次', points: 6, completed: false }
      ],
      societyMembers: [
        { id: 'm_1', name: '我（园主）', role: '会长', score: 0, isPlayer: true },
        { id: 'm_2', name: '青砖墨客', role: '副会长', score: 48 },
        { id: 'm_3', name: '古韵寻珍', role: '精英会员', score: 36 },
        { id: 'm_4', name: '刀马旦', role: '普通会员', score: 20 },
        { id: 'm_5', name: '江南雨客', role: '普通会员', score: 12 }
      ],
      marketListings: generateDailyMarketListings(SOLAR_TERMS[0]),
      activeAuctionLot: null,
      toastMessage: null
    };
  };

  const [state, setState] = useState<GameState>(loadInitialState);

  // 自动存档
  useEffect(() => {
    try {
      const { toastMessage, activeAuctionLot, ...persistable } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch (e) {
      console.warn('Failed to auto save', e);
    }
  }, [state]);

  const showToast = useCallback((msg: string) => {
    setState(prev => ({ ...prev, toastMessage: msg }));
    setTimeout(() => {
      setState(prev => (prev.toastMessage === msg ? { ...prev, toastMessage: null } : prev));
    }, 2800);
  }, []);

  // 技艺等级获取
  const getSkillLevel = useCallback(
    (branch: SkillBranch) => {
      const node = state.skills.find(s => s.branch === branch);
      return node ? node.level : 0;
    },
    [state.skills]
  );

  // 1. 节气推进
  const advanceSolarTerm = useCallback(() => {
    setState(prev => {
      const nextIndex = (prev.solarTermIndex + 1) % 24;
      const nextTerm = SOLAR_TERMS[nextIndex];
      const newDay = prev.day + 15;
      showToast(`历法更迭：进入【${nextTerm.name}】节气！${nextTerm.features}`);
      soundManager.playChimeSound();

      return {
        ...prev,
        solarTermIndex: nextIndex,
        solarProgress: 0,
        day: newDay,
        marketListings: generateDailyMarketListings(nextTerm)
      };
    });
  }, [showToast]);

  // 时间轮询与植物生长、拍卖行心跳
  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => {
        let changed = false;
        const now = Date.now();

        // 生长倒计时检测
        const updatedTerraces = prev.terraces.map(t => {
          if (t.status === 'growing' && t.plantedAt && t.growDurationSeconds) {
            const elapsed = (now - t.plantedAt) / 1000;
            if (elapsed >= t.growDurationSeconds) {
              changed = true;
              return { ...t, status: 'ready' as const };
            }
          }
          return t;
        });

        // 节气进度缓缓流转 (每120秒一轮自然节气)
        let nextSolarProg = prev.solarProgress + 0.4;
        let newSolarIdx = prev.solarTermIndex;
        let newDay = prev.day;
        if (nextSolarProg >= 100) {
          nextSolarProg = 0;
          newSolarIdx = (prev.solarTermIndex + 1) % 24;
          newDay += 15;
          changed = true;
        }

        // 拍卖行 NPC 倒计时与加价模拟
        let updatedAuction = prev.activeAuctionLot;
        if (updatedAuction && updatedAuction.status === 'active') {
          changed = true;
          const nextSec = updatedAuction.secondsRemaining - 1;
          if (nextSec <= 0) {
            // 结算拍卖
            const sold = updatedAuction.currentBid >= updatedAuction.reservePrice && updatedAuction.highestBidder !== '起拍底价';
            updatedAuction = {
              ...updatedAuction,
              secondsRemaining: 0,
              status: sold ? 'sold' : 'unsold'
            };
            if (sold) {
              soundManager.playHammerSound();
              showToast(`拍品以 ${updatedAuction.currentBid} 文成交！由【${updatedAuction.highestBidder}】竞得！`);
            } else {
              showToast('本轮拍品未达托底保留价，已流拍归还。');
            }
          } else {
            // NPC 出价心跳
            if (Math.random() < 0.4) {
              const { updatedLot, bidPlaced, announcement } = simulateNpcBiddingStep({
                ...updatedAuction,
                secondsRemaining: nextSec
              });
              if (bidPlaced) {
                soundManager.playHammerSound();
                if (announcement) showToast(announcement);
              }
              updatedAuction = updatedLot;
            } else {
              updatedAuction = {
                ...updatedAuction,
                secondsRemaining: nextSec
              };
            }
          }
        }

        if (changed) {
          return {
            ...prev,
            solarProgress: nextSolarProg,
            solarTermIndex: newSolarIdx,
            day: newDay,
            terraces: updatedTerraces,
            activeAuctionLot: updatedAuction
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showToast]);

  // 台地开垦
  const unlockTerrace = useCallback((id: string) => {
    setState(prev => {
      const target = prev.terraces.find(t => t.id === id);
      if (!target || target.unlocked) return prev;
      if (prev.coins < target.unlockCost) {
        showToast('铜钱不足，无法开辟此台地！');
        return prev;
      }
      soundManager.playCoinSound();
      showToast(`成功开辟【${target.name}】！`);
      return {
        ...prev,
        coins: prev.coins - target.unlockCost,
        terraces: prev.terraces.map(t => (t.id === id ? { ...t, unlocked: true } : t))
      };
    });
  }, [showToast]);

  // 台地条件调节
  const updateTerraceCondition = useCallback((id: string, conditions: Partial<Terrace>) => {
    setState(prev => ({
      ...prev,
      terraces: prev.terraces.map(t => (t.id === id ? { ...t, ...conditions } : t))
    }));
  }, []);

  // 播种
  const plantTerrace = useCallback((terraceId: string, varietyId: string) => {
    const variety = VARIETIES_MAP.get(varietyId);
    if (!variety) return;

    setState(prev => {
      const seedCount = prev.seeds[varietyId] || 0;
      if (seedCount <= 0) {
        showToast(`手中已无【${variety.name}】种子，请至商铺购买！`);
        return prev;
      }

      showToast(`播下【${variety.name}】，开始静心培育！`);
      return {
        ...prev,
        seeds: {
          ...prev.seeds,
          [varietyId]: seedCount - 1
        },
        terraces: prev.terraces.map(t =>
          t.id === terraceId
            ? {
                ...t,
                currentVarietyId: varietyId,
                status: 'growing' as const,
                plantedAt: Date.now(),
                growDurationSeconds: variety.growTimeSeconds
              }
            : t
        )
      };
    });
  }, [showToast]);

  // 收获
  const harvestTerrace = useCallback((terraceId: string) => {
    setState(prev => {
      const t = prev.terraces.find(ter => ter.id === terraceId);
      if (!t || t.status !== 'ready' || !t.currentVarietyId) return prev;

      const variety = VARIETIES_MAP.get(t.currentVarietyId);
      if (!variety) return prev;

      const solarTerm = SOLAR_TERMS[prev.solarTermIndex];
      const breedingLevel = prev.skills.find(s => s.branch === 'breeding')?.level || 0;
      const climateEval = evaluateTerraceClimate(t, variety, solarTerm, breedingLevel);

      // 一次收获采摘 2 颗生核
      const raw1 = generateRawWalnut(t.name, t.currentVarietyId, climateEval);
      const raw2 = generateRawWalnut(t.name, t.currentVarietyId, climateEval);

      soundManager.playCoinSound();
      showToast(`采摘完成！收获 2 颗【未开青皮 · ${variety.name}】，匹配度 ${climateEval.matchingScore}！`);

      return {
        ...prev,
        walnuts: [raw1, raw2, ...prev.walnuts],
        terraces: prev.terraces.map(ter =>
          ter.id === terraceId
            ? {
                ...ter,
                status: 'empty' as const,
                currentVarietyId: undefined,
                plantedAt: undefined,
                lastHarvestQuality: climateEval.qualityCoefficient
              }
            : ter
        )
      };
    });
  }, [showToast]);

  // 催熟
  const speedUpTerrace = useCallback((terraceId: string) => {
    setState(prev => {
      const t = prev.terraces.find(ter => ter.id === terraceId);
      if (!t || t.status !== 'growing') return prev;
      if (prev.coins < 30) {
        showToast('铜钱不足，无法施用琼浆催熟！');
        return prev;
      }
      soundManager.playCoinSound();
      showToast('施用灵泉甘露，核树瞬间结实挂枝！');
      return {
        ...prev,
        coins: prev.coins - 30,
        terraces: prev.terraces.map(ter => (ter.id === terraceId ? { ...ter, status: 'ready' as const } : ter))
      };
    });
  }, [showToast]);

  // 2. 开核
  const crackWalnutById = useCallback((walnutId: string, tool: CrackingTool): WalnutItem | null => {
    let resultItem: WalnutItem | null = null;
    setState(prev => {
      const raw = prev.walnuts.find(w => w.id === walnutId && w.isUncracked);
      if (!raw) return prev;

      const crackingLevel = prev.skills.find(s => s.branch === 'cracking')?.level || 0;
      const dummyClimate = {
        matchingScore: 80,
        qualityCoefficient: 64,
        guaranteedGrade: 'three_ridges' as const,
        scores: { altitude: 80, soil: 80, humidity: 80, temperature: 80, light: 80, water: 80, fertilizer: 60 },
        effectiveConditions: { altitude: 'mountain' as const, soil: 'sand' as const, humidity: 'moderate' as const, temperature: 'mild' as const, light: 'full' as const, water: 'spring' as const, fertilizer: 'none' as const },
        gradeProbabilities: { common: 0.5, three_ridges: 0.28, four_ridges: 0.15, five_ridges: 0.05, six_ridges: 0.018, abnormal: 0.002 }
      };

      resultItem = crackWalnut(raw, dummyClimate, tool, crackingLevel);
      soundManager.playCrackSound();

      if (resultItem.grade === 'six_ridges' || resultItem.grade === 'abnormal' || resultItem.grade === 'five_ridges') {
        soundManager.playChimeSound();
      }

      showToast(`破壳揭晓！开出【${resultItem.gradeName}】，边宽 ${resultItem.edgeWidth}mm！`);

      return {
        ...prev,
        walnuts: prev.walnuts.map(w => (w.id === walnutId ? resultItem! : w))
      };
    });
    return resultItem;
  }, [showToast]);

  // 鉴定
  const appraiseWalnutById = useCallback((walnutId: string) => {
    setState(prev => {
      const w = prev.walnuts.find(item => item.id === walnutId && !item.isUncracked);
      if (!w || w.hasCertificate) return prev;

      const appraisalLevel = prev.skills.find(s => s.branch === 'appraisal')?.level || 0;
      const fee = Math.max(10, Math.round(50 * (1 - appraisalLevel * 0.1)));

      if (prev.coins < fee) {
        showToast('铜钱不足以支付名家鉴定润金！');
        return prev;
      }

      soundManager.playCoinSound();
      soundManager.playChimeSound();
      showToast(`名家鉴定完毕！获赐【${w.appraisalLevel === 'divine' ? '神品' : w.appraisalLevel === 'precious' ? '珍品' : w.appraisalLevel === 'superior' ? '上品' : '良品'}】烫印证书！`);

      return {
        ...prev,
        coins: prev.coins - fee,
        walnuts: prev.walnuts.map(item =>
          item.id === walnutId
            ? { ...item, hasCertificate: true, estimatedValue: Math.round(item.estimatedValue * 1.25) }
            : item
        )
      };
    });
  }, [showToast]);

  // 配对
  const pairWalnutsById = useCallback((w1Id: string, w2Id: string): boolean => {
    let success = false;
    setState(prev => {
      const w1 = prev.walnuts.find(w => w.id === w1Id && !w.isUncracked && !w.isPairedBox);
      const w2 = prev.walnuts.find(w => w.id === w2Id && !w.isUncracked && !w.isPairedBox);
      if (!w1 || !w2 || w1Id === w2Id) return prev;

      const pairResult = calculatePairing(w1, w2);
      success = pairResult.isSuccess;

      if (!success) {
        showToast(`配对度 ${pairResult.score}%：${pairResult.commentary}`);
        return prev;
      }

      soundManager.playChimeSound();
      showToast(`【配对大成】配对度 ${pairResult.score}%！放入定制锦盒，身价暴涨！`);

      // 封装为成对文玩锦盒
      const boxedItem: WalnutItem = {
        ...w1,
        id: 'pair_' + Date.now(),
        name: `【对核锦盒】${w1.gradeName} 双娇`,
        isPairedBox: true,
        pairingScore: pairResult.score,
        pairedWithId: w2.id,
        estimatedValue: Math.round((w1.estimatedValue + w2.estimatedValue) * pairResult.boxValueMultiplier)
      };

      return {
        ...prev,
        walnuts: [boxedItem, ...prev.walnuts.filter(w => w.id !== w1Id && w.id !== w2Id)]
      };
    });
    return success;
  }, [showToast]);

  // 盘玩包浆
  const playWithWalnut = useCallback((walnutId: string) => {
    setState(prev => {
      const target = prev.walnuts.find(w => w.id === walnutId && !w.isUncracked);
      if (!target) return prev;

      const restLevel = prev.skills.find(s => s.branch === 'restoration')?.level || 0;
      const patinaGain = 8 + restLevel * 2;
      const newPatina = Math.min(100, (target.patinaLevel || 0) + patinaGain);
      const newPlayCount = (target.playCount || 0) + 1;

      soundManager.playCrackSound();
      showToast(`摩挲盘玩：包浆度达 ${newPatina}%！通体光华初显！`);

      return {
        ...prev,
        walnuts: prev.walnuts.map(w =>
          w.id === walnutId
            ? {
                ...w,
                patinaLevel: newPatina,
                playCount: newPlayCount,
                estimatedValue: Math.round(w.estimatedValue * 1.05)
              }
            : w
        )
      };
    });
  }, [showToast]);

  // 直售行商
  const sellWalnutDirect = useCallback((walnutId: string, traderId: string = 'trader_pu') => {
    setState(prev => {
      const item = prev.walnuts.find(w => w.id === walnutId);
      if (!item) return prev;

      const trader = NPC_TRADERS.find(t => t.id === traderId) || NPC_TRADERS[0];
      const payout = Math.round((item.estimatedValue || 50) * trader.priceModifier);

      soundManager.playCoinSound();
      showToast(`成功将【${item.name}】出售给【${trader.name}】，换得铜钱 ${payout} 文！`);

      return {
        ...prev,
        coins: prev.coins + payout,
        walnuts: prev.walnuts.filter(w => w.id !== walnutId)
      };
    });
  }, [showToast]);

  // 3. 藏品保养
  const maintainAntiqueById = useCallback((antiqueId: string) => {
    setState(prev => {
      const target = prev.antiques.find(a => a.id === antiqueId);
      if (!target || !target.unlocked) return prev;

      if (prev.coins < 150) {
        showToast('铜钱不足，无法采购上等羊毫与养护矿物油！');
        return prev;
      }

      soundManager.playCoinSound();
      showToast(`精心除尘打蜡！【${target.name}】容光焕发，恢复精品状态！`);

      return {
        ...prev,
        coins: prev.coins - 150,
        antiques: prev.antiques.map(a =>
          a.id === antiqueId
            ? {
                ...a,
                condition: 'masterpiece' as const,
                maintenanceLevel: 100,
                baseValue: Math.round(a.baseValue * 1.2)
              }
            : a
        )
      };
    });
  }, [showToast]);

  // 展馆上架
  const assignAntiqueToHall = useCallback(
    (antiqueId: string, hallId: 'walnut_hall' | 'painting_hall' | 'curio_hall', slotIndex: number, isTreasure: boolean = false) => {
      setState(prev => {
        const item = prev.antiques.find(a => a.id === antiqueId);
        if (!item) return prev;

        showToast(`已将【${item.name}】陈列于【${hallId === 'walnut_hall' ? '核桃厅' : hallId === 'painting_hall' ? '书画厅' : '器物厅'}】第 ${slotIndex + 1} 展位！`);
        return {
          ...prev,
          antiques: prev.antiques.map(a => {
            // 清理原同位置的展示
            if (a.displayLocation?.hallId === hallId && a.displayLocation?.slotIndex === slotIndex) {
              return { ...a, displayLocation: undefined, isTreasureOfHall: false };
            }
            if (a.id === antiqueId) {
              return {
                ...a,
                displayLocation: { hallId, slotIndex },
                isTreasureOfHall: isTreasure
              };
            }
            return a;
          })
        };
      });
    },
    [showToast]
  );

  const removeAntiqueFromHall = useCallback((antiqueId: string) => {
    setState(prev => ({
      ...prev,
      antiques: prev.antiques.map(a => (a.id === antiqueId ? { ...a, displayLocation: undefined, isTreasureOfHall: false } : a))
    }));
  }, []);

  // 4. 收藏家兑换
  const submitExchange = useCallback((exchangeId: string, walnutIds: string[]): boolean => {
    let success = false;
    setState(prev => {
      const ex = prev.exchanges.find(e => e.id === exchangeId);
      if (!ex || ex.isCompleted) return prev;

      const items = prev.walnuts.filter(w => walnutIds.includes(w.id));
      if (items.length === 0) {
        showToast('请选择符合委托要求的核桃！');
        return prev;
      }

      // 验证条件
      if (ex.reqMinRidges && items.some(w => (w.ridges || 2) < ex.reqMinRidges!)) {
        showToast(`核桃棱数不足！要求至少达到 ${ex.reqMinRidges} 棱！`);
        return prev;
      }
      if (ex.reqMustBePair && !items.some(w => w.isPairedBox || (w.pairingScore || 0) >= 85)) {
        showToast('要求提交【配对成对】的锦盒！');
        return prev;
      }
      if (ex.reqMinSizeMm && items.some(w => (w.edgeWidth || 0) < ex.reqMinSizeMm!)) {
        showToast(`核桃边宽尺寸不足 ${ex.reqMinSizeMm}mm！`);
        return prev;
      }

      success = true;
      const antique = ANTIQUES_MAP.get(ex.targetAntiqueId);
      soundManager.playChimeSound();
      showToast(`兑换成功！从【${ex.collectorId}】处迎回国宝【${antique ? antique.name : '珍宝'}】！`);

      return {
        ...prev,
        walnuts: prev.walnuts.filter(w => !walnutIds.includes(w.id)),
        antiques: prev.antiques.map(a => (a.id === ex.targetAntiqueId ? { ...a, unlocked: true } : a)),
        exchanges: prev.exchanges.map(e => (e.id === exchangeId ? { ...e, isCompleted: true } : e)),
        collectors: prev.collectors.map(c => (c.id === ex.collectorId ? { ...c, favor: c.favor + 20 } : c))
      };
    });
    return success;
  }, [showToast]);

  // 回信
  const replyLetter = useCallback((letterId: string, optionIndex: number) => {
    setState(prev => {
      const letter = prev.letters.find(l => l.id === letterId);
      if (!letter || letter.repliedIndex !== undefined || !letter.replyOptions) return prev;

      const opt = letter.replyOptions[optionIndex];
      showToast(`回信已寄出！收藏家好感度 +${opt.favorDelta}！`);

      return {
        ...prev,
        letters: prev.letters.map(l => (l.id === letterId ? { ...l, repliedIndex: optionIndex } : l)),
        collectors: prev.collectors.map(c =>
          c.id === letter.collectorId ? { ...c, favor: c.favor + opt.favorDelta } : c
        )
      };
    });
  }, [showToast]);

  // 领信件奖励
  const claimLetterReward = useCallback((letterId: string) => {
    setState(prev => {
      const letter = prev.letters.find(l => l.id === letterId);
      if (!letter || letter.rewardClaimed) return prev;

      soundManager.playCoinSound();
      showToast(`领取信件附件：${letter.rewardDesc || '铜钱丰厚'}！`);

      return {
        ...prev,
        coins: prev.coins + (letter.rewardCoins || 0),
        ingots: prev.ingots + (letter.rewardIngots || 0),
        letters: prev.letters.map(l => (l.id === letterId ? { ...l, rewardClaimed: true } : l))
      };
    });
  }, [showToast]);

  // 5. 商铺与拍卖
  const buySeed = useCallback((varietyId: string, count: number = 1) => {
    const variety = VARIETIES_MAP.get(varietyId);
    if (!variety) return;

    setState(prev => {
      const breedingLvl = prev.skills.find(s => s.branch === 'breeding')?.level || 0;
      const discount = 1 - breedingLvl * 0.08;
      const totalCost = Math.round(variety.seedPrice * count * discount);

      if (prev.coins < totalCost) {
        showToast('铜钱不足，无法购入种子！');
        return prev;
      }

      soundManager.playCoinSound();
      showToast(`成功购入 ${count} 份【${variety.name}】良种！`);

      return {
        ...prev,
        coins: prev.coins - totalCost,
        seeds: {
          ...prev.seeds,
          [varietyId]: (prev.seeds[varietyId] || 0) + count
        }
      };
    });
  }, [showToast]);

  const buyMarketItem = useCallback((listingId: string) => {
    setState(prev => {
      const listing = prev.marketListings.find(l => l.id === listingId);
      if (!listing) return prev;

      if (prev.coins < listing.price) {
        showToast('铜钱不足以收购此货物！');
        return prev;
      }

      soundManager.playCoinSound();
      showToast(`成功购下【${listing.item.name}】！已收入行囊！`);

      return {
        ...prev,
        coins: prev.coins - listing.price,
        walnuts: [listing.item, ...prev.walnuts],
        marketListings: prev.marketListings.filter(l => l.id !== listingId)
      };
    });
  }, [showToast]);

  const startAuctionLot = useCallback((itemId: string, isWalnut: boolean, reservePrice: number) => {
    setState(prev => {
      if (prev.activeAuctionLot && prev.activeAuctionLot.status === 'active') {
        showToast('当前已有拍品正在竞拍中！');
        return prev;
      }

      const item = isWalnut
        ? prev.walnuts.find(w => w.id === itemId)
        : prev.antiques.find(a => a.id === itemId);

      if (!item) return prev;

      const lot = createAuctionLot(item, isWalnut, reservePrice);
      soundManager.playHammerSound();
      showToast(`拍品【${item.name}】已登台开拍！起拍价 ${lot.startingPrice} 文！`);

      return {
        ...prev,
        activeAuctionLot: lot,
        walnuts: isWalnut ? prev.walnuts.filter(w => w.id !== itemId) : prev.walnuts
      };
    });
  }, [showToast]);

  const playerBidOnAuction = useCallback(() => {
    setState(prev => {
      const lot = prev.activeAuctionLot;
      if (!lot || lot.status !== 'active') return prev;

      const increment = Math.max(100, Math.round(lot.currentBid * 0.1));
      const playerBid = lot.currentBid + increment;

      if (prev.coins < playerBid) {
        showToast('所持铜钱不足，无法举牌加价！');
        return prev;
      }

      soundManager.playHammerSound();
      showToast(`你豪气举牌！出价 ${playerBid} 文！`);

      return {
        ...prev,
        activeAuctionLot: {
          ...lot,
          currentBid: playerBid,
          highestBidder: '你（园主）',
          highestBidderIsPlayer: true,
          secondsRemaining: Math.min(45, lot.secondsRemaining + 6), // 举牌加时
          bidHistory: [
            { bidder: '你（园主）', amount: playerBid, time: `${lot.secondsRemaining}秒` },
            ...lot.bidHistory.slice(0, 7)
          ]
        }
      };
    });
  }, [showToast]);

  const claimAuctionProceeds = useCallback(() => {
    setState(prev => {
      const lot = prev.activeAuctionLot;
      if (!lot) return prev;

      if (lot.status === 'sold') {
        // 如果买家是玩家自己拍下的
        if (lot.highestBidderIsPlayer && lot.walnutItem) {
          soundManager.playCoinSound();
          showToast(`成功竞得拍品【${lot.walnutItem.name}】！已领入行囊！`);
          return {
            ...prev,
            coins: prev.coins - lot.currentBid,
            walnuts: [lot.walnutItem, ...prev.walnuts],
            activeAuctionLot: null
          };
        } else {
          // 玩家作为卖家获得银两（扣除 10% 佣金）
          const mgmtLvl = prev.skills.find(s => s.branch === 'management')?.level || 0;
          const commissionRate = Math.max(0.04, 0.1 - mgmtLvl * 0.012);
          const netPayout = Math.round(lot.currentBid * (1 - commissionRate));

          soundManager.playCoinSound();
          showToast(`拍卖款到账！扣除手续费后入账 ${netPayout} 文！`);
          return {
            ...prev,
            coins: prev.coins + netPayout,
            activeAuctionLot: null
          };
        }
      } else if (lot.status === 'unsold') {
        // 退还物品
        showToast('拍品已领回。');
        return {
          ...prev,
          walnuts: lot.walnutItem ? [lot.walnutItem, ...prev.walnuts] : prev.walnuts,
          activeAuctionLot: null
        };
      }
      return prev;
    });
  }, [showToast]);

  // 6. 技艺升级
  const upgradeSkillNode = useCallback((branch: SkillBranch) => {
    setState(prev => {
      const node = prev.skills.find(s => s.branch === branch);
      if (!node || node.level >= node.maxLevel) return prev;

      if (prev.skillPoints < node.costPoints) {
        showToast(`技艺点不足！需消耗 ${node.costPoints} 点！`);
        return prev;
      }

      soundManager.playChimeSound();
      showToast(`技艺精进！【${node.name}】提升至 ${node.level + 1} 级！`);

      return {
        ...prev,
        skillPoints: prev.skillPoints - node.costPoints,
        skills: prev.skills.map(s =>
          s.branch === branch
            ? { ...s, level: s.level + 1, costPoints: s.costPoints + 5 }
            : s
        )
      };
    });
  }, [showToast]);

  // 7. 协会任务
  const claimSocietyTask = useCallback((taskId: string) => {
    setState(prev => {
      const task = prev.societyTasks.find(t => t.id === taskId);
      if (!task || task.completed) return prev;

      const earnedPts = task.points * (task.isUpgraded ? 2 : 1);
      soundManager.playChimeSound();
      showToast(`完成协会任务！为本会贡献 ${earnedPts} 积分，获得协会币 +${earnedPts * 2}！`);

      return {
        ...prev,
        societyCoins: prev.societyCoins + earnedPts * 2,
        societyTasks: prev.societyTasks.map(t => (t.id === taskId ? { ...t, completed: true } : t)),
        societyMembers: prev.societyMembers.map(m => (m.isPlayer ? { ...m, score: m.score + earnedPts } : m))
      };
    });
  }, [showToast]);

  const upgradeSocietyTask = useCallback((taskId: string) => {
    setState(prev => {
      const task = prev.societyTasks.find(t => t.id === taskId);
      if (!task || task.isUpgraded || task.completed) return prev;

      const costIngots = task.points * 3;
      if (prev.ingots < costIngots) {
        showToast(`元宝不足！升级需 ${costIngots} 元宝！`);
        return prev;
      }

      soundManager.playCoinSound();
      showToast(`任务已升级翻倍！分值升至 ${task.points * 2} 分！`);

      return {
        ...prev,
        ingots: prev.ingots - costIngots,
        societyTasks: prev.societyTasks.map(t => (t.id === taskId ? { ...t, isUpgraded: true } : t))
      };
    });
  }, [showToast]);

  return (
    <GameContext.Provider
      value={{
        ...state,
        showToast,
        unlockTerrace,
        updateTerraceCondition,
        plantTerrace,
        harvestTerrace,
        speedUpTerrace,
        crackWalnutById,
        appraiseWalnutById,
        pairWalnutsById,
        playWithWalnut,
        sellWalnutDirect,
        maintainAntiqueById,
        assignAntiqueToHall,
        removeAntiqueFromHall,
        submitExchange,
        replyLetter,
        claimLetterReward,
        buySeed,
        buyMarketItem,
        startAuctionLot,
        playerBidOnAuction,
        claimAuctionProceeds,
        upgradeSkillNode,
        claimSocietyTask,
        upgradeSocietyTask,
        advanceSolarTerm
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
