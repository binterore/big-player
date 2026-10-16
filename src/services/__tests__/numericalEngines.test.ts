import { describe, it, expect } from 'vitest';
import { evaluateTerraceClimate } from '../climateEngine';
import { calculatePairing } from '../pairingEngine';
import { crackWalnut, generateRawWalnut } from '../walnutGenerator';
import { VARIETIES_MAP } from '../../config/varietiesData';
import { WalnutItem } from '../../types';

describe('台地系统数值模型 (GDD 15.3 节标准算例验算)', () => {
  it('应当准确复刻策划文档 15.3 表 15-8 算例：岩生异棱冲五棱匹配度为 97，品质系数为 77.6', () => {
    const variety = VARIETIES_MAP.get('rock_ridge')!;
    expect(variety).toBeDefined();

    // 玩家配置 (表 15-8)
    const conditions = {
      altitude: 'snowline' as const, // 适宜: 高山/雪线 -> 100分 (权20%) = 20.0
      soil: 'rock' as const,         // 适宜: 岩土 -> 100分 (权15%) = 15.0
      humidity: 'dry' as const,      // 适宜: 干燥 -> 100分 (权15%) = 15.0
      temperature: 'cold' as const,  // 适宜: 冷凉 -> 100分 (权15%) = 15.0
      light: 'strong' as const,      // 适宜: 强日照 -> 100分 (权15%) = 15.0
      waterSource: 'spring' as const,// 适宜: 山泉 -> 100分 (权10%) = 10.0
      fertilizer: 'boron' as const   // 养料: 硼元素 -> 70分 (权10%) = 7.0
    };

    const result = evaluateTerraceClimate(conditions, variety);

    // 验算得分
    expect(result.scores.altitude).toBe(100);
    expect(result.scores.soil).toBe(100);
    expect(result.scores.humidity).toBe(100);
    expect(result.scores.temperature).toBe(100);
    expect(result.scores.light).toBe(100);
    expect(result.scores.water).toBe(100);
    expect(result.scores.fertilizer).toBe(70);

    // 验算匹配度与品质系数
    expect(result.matchingScore).toBe(97.0);
    expect(result.qualityCoefficient).toBe(77.6);

    // 验算保底规则 (表 15-9)
    // 77.6 >= 70 -> 保底至少出 1 个五棱
    // 77.6 < 85 -> 六棱不保底
    expect(result.guaranteedGrade).toBe('five_ridges');
  });

  it('当台地环境恶劣时，品质系数应降低且保底为普核', () => {
    const variety = VARIETIES_MAP.get('rock_ridge')!;
    const poorConditions = {
      altitude: 'lowland' as const,
      soil: 'clay' as const,
      humidity: 'very_humid' as const,
      temperature: 'hot' as const,
      light: 'shade' as const,
      waterSource: 'rain' as const,
      fertilizer: 'none' as const
    };

    const result = evaluateTerraceClimate(poorConditions, variety);
    expect(result.matchingScore).toBeLessThan(35);
    expect(result.guaranteedGrade).toBe('common');
  });
});

describe('五维配对系统 (Pairing Engine)', () => {
  it('两只属性完全一致的核桃配对度应达到 100%，判定为天造地设', () => {
    const w1: WalnutItem = {
      id: 'w1',
      name: '四棱 · 岩生异棱',
      varietyId: 'rock_ridge',
      varietyName: '岩生异棱',
      isUncracked: false,
      grade: 'four_ridges',
      ridges: 4,
      edgeWidth: 42.0,
      bellyWidth: 41.0,
      height: 39.5,
      posture: 'standard',
      pattern: 'beast_face',
      skinColor: 'oxford_red',
      estimatedValue: 1000
    };

    const w2: WalnutItem = { ...w1, id: 'w2' };

    const pairResult = calculatePairing(w1, w2);
    expect(pairResult.score).toBe(100);
    expect(pairResult.isSuccess).toBe(true);
    expect(pairResult.isPerfect).toBe(true);
    expect(pairResult.boxValueMultiplier).toBe(4.0);
  });

  it('棱数不匹配时应当受到严惩，不能成功配对', () => {
    const w1: WalnutItem = {
      id: 'w1',
      name: '四棱',
      varietyId: 'rock_ridge',
      varietyName: '岩生异棱',
      isUncracked: false,
      grade: 'four_ridges',
      ridges: 4,
      edgeWidth: 42.0,
      bellyWidth: 41.0,
      height: 39.5,
      posture: 'standard',
      pattern: 'beast_face',
      skinColor: 'oxford_red',
      estimatedValue: 1000
    };

    const w2: WalnutItem = {
      ...w1,
      id: 'w2',
      grade: 'three_ridges',
      ridges: 3
    };

    const pairResult = calculatePairing(w1, w2);
    expect(pairResult.dimensions.ridges).toBe(0); // 严厉归零
    expect(pairResult.isSuccess).toBe(false);
  });
});

describe('开核系统 (Cracking Simulation)', () => {
  it('开核后青皮应当剥开，生成完整的五维属性与品相证书', () => {
    const variety = VARIETIES_MAP.get('plain_big')!;
    const conditions = {
      altitude: 'lowland' as const,
      soil: 'loam' as const,
      humidity: 'humid' as const,
      temperature: 'warm' as const,
      light: 'full' as const,
      waterSource: 'rain' as const,
      fertilizer: 'organic' as const
    };
    const climateEval = evaluateTerraceClimate(conditions, variety);
    const raw = generateRawWalnut('测试田', 'plain_big', climateEval);

    expect(raw.isUncracked).toBe(true);

    const cracked = crackWalnut(raw, climateEval, 'hammer', 2);
    expect(cracked.isUncracked).toBe(false);
    expect(cracked.edgeWidth).toBeGreaterThan(35);
    expect(cracked.posture).toBeDefined();
    expect(cracked.pattern).toBeDefined();
    expect(cracked.skinColor).toBeDefined();
    expect(cracked.integrity).toBeGreaterThan(80);
    expect(cracked.appraisalLevel).toBeDefined();
    expect(cracked.estimatedValue).toBeGreaterThan(0);
  });
});
