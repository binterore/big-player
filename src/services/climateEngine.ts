import { Altitude, Soil, Humidity, Temperature, Light, WaterSource, Fertilizer, Variety, SolarTerm, WalnutGrade } from '../types';

const ALTITUDE_ORDER: Altitude[] = ['lowland', 'hills', 'mountain', 'snowline'];
const SOIL_ORDER: Soil[] = ['sand', 'loam', 'clay', 'rock'];
const HUMIDITY_ORDER: Humidity[] = ['dry', 'moderate', 'humid', 'very_humid'];
const TEMP_ORDER: Temperature[] = ['cold', 'mild', 'warm', 'hot'];
const LIGHT_ORDER: Light[] = ['shade', 'partial', 'full', 'strong'];
const WATER_ORDER: WaterSource[] = ['rain', 'stream', 'spring', 'snow'];

function getStepDistance<T>(order: T[], current: T, preferred: T | T[]): number {
  const currentIndex = order.indexOf(current);
  if (currentIndex === -1) return 3;

  if (Array.isArray(preferred)) {
    if (preferred.includes(current)) return 0;
    let minDistance = 999;
    for (const p of preferred) {
      const pIndex = order.indexOf(p);
      if (pIndex !== -1) {
        minDistance = Math.min(minDistance, Math.abs(currentIndex - pIndex));
      }
    }
    return minDistance;
  } else {
    const targetIndex = order.indexOf(preferred);
    if (targetIndex === -1) return 3;
    return Math.abs(currentIndex - targetIndex);
  }
}

function distanceToScore(distance: number): number {
  if (distance === 0) return 100;
  if (distance === 1) return 70;
  if (distance === 2) return 40;
  return 0;
}

export function applySolarDelta<T>(order: T[], current: T, delta: number): T {
  const currentIndex = order.indexOf(current);
  if (currentIndex === -1) return current;
  const newIndex = Math.max(0, Math.min(order.length - 1, currentIndex + delta));
  return order[newIndex];
}

export interface ClimateEvaluation {
  matchingScore: number; // 0-100
  qualityCoefficient: number; // 0-80
  guaranteedGrade: WalnutGrade;
  scores: {
    altitude: number;
    soil: number;
    humidity: number;
    temperature: number;
    light: number;
    water: number;
    fertilizer: number;
  };
  effectiveConditions: {
    altitude: Altitude;
    soil: Soil;
    humidity: Humidity;
    temperature: Temperature;
    light: Light;
    water: WaterSource;
    fertilizer: Fertilizer;
  };
  gradeProbabilities: Record<WalnutGrade, number>;
}

export function evaluateTerraceClimate(
  conditions: {
    altitude: Altitude;
    soil: Soil;
    humidity: Humidity;
    temperature: Temperature;
    light: Light;
    waterSource: WaterSource;
    fertilizer: Fertilizer;
  },
  variety: Variety,
  solarTerm?: SolarTerm,
  breedingSkillLevel: number = 0
): ClimateEvaluation {
  // 节气修正
  const effHumidity = solarTerm
    ? applySolarDelta(HUMIDITY_ORDER, conditions.humidity, solarTerm.humidityDelta)
    : conditions.humidity;
  const effTemperature = solarTerm
    ? applySolarDelta(TEMP_ORDER, conditions.temperature, solarTerm.tempDelta)
    : conditions.temperature;
  const effLight = solarTerm
    ? applySolarDelta(LIGHT_ORDER, conditions.light, solarTerm.lightDelta)
    : conditions.light;

  // 1. 各维度得分
  const altDist = getStepDistance(ALTITUDE_ORDER, conditions.altitude, variety.preferredAltitude);
  const altScore = distanceToScore(altDist);

  const soilDist = getStepDistance(SOIL_ORDER, conditions.soil, variety.preferredSoil);
  const soilScore = distanceToScore(soilDist);

  const humDist = getStepDistance(HUMIDITY_ORDER, effHumidity, variety.idealHumidity);
  const humScore = distanceToScore(humDist);

  const tempDist = getStepDistance(TEMP_ORDER, effTemperature, variety.idealTemperature);
  const tempScore = distanceToScore(tempDist);

  const lightDist = getStepDistance(LIGHT_ORDER, effLight, variety.idealLight);
  const lightScore = distanceToScore(lightDist);

  const waterDist = getStepDistance(WATER_ORDER, conditions.waterSource, variety.preferredWater);
  const waterScore = distanceToScore(waterDist);

  // 养料加分逻辑 (根据文档 15.3: 硼元素用于冲多棱，有机肥稳产，符合算例中70分)
  let fertScore = 40;
  if (conditions.fertilizer === 'none') {
    fertScore = 40;
  } else if (conditions.fertilizer === 'boron') {
    // 硼元素在冲异棱品种时得高分
    fertScore = variety.id.includes('ridge') ? 70 : 60;
  } else if (conditions.fertilizer === 'compound') {
    fertScore = 70;
  } else {
    fertScore = 60;
  }

  // 加权求和 (文档 15.3 表 15-6)
  // 海拔 20%, 土壤 15%, 湿度 15%, 温度 15%, 光照 15%, 水源 10%, 养料 10%
  let rawScore =
    altScore * 0.20 +
    soilScore * 0.15 +
    humScore * 0.15 +
    tempScore * 0.15 +
    lightScore * 0.15 +
    waterScore * 0.10 +
    fertScore * 0.10;

  // 技能加成：每级育种技能 +3 分基础匹配度
  rawScore = Math.min(100, rawScore + breedingSkillLevel * 3);

  const matchingScore = Math.round(rawScore * 10) / 10;
  const qualityCoefficient = Math.round(matchingScore * 0.8 * 10) / 10;

  // 保底规则 (表 15-7)
  let guaranteedGrade: WalnutGrade = 'common';
  if (qualityCoefficient >= 85) {
    guaranteedGrade = 'six_ridges';
  } else if (qualityCoefficient >= 70) {
    guaranteedGrade = 'five_ridges';
  } else if (qualityCoefficient >= 55) {
    guaranteedGrade = 'four_ridges';
  } else if (qualityCoefficient >= 35) {
    guaranteedGrade = 'three_ridges';
  }

  // 概率计算 (表 15-7: 普核 60%, 三棱 25%, 四棱 10%, 五棱 4%, 六棱 1%, 异品 0.2%)
  // 实际概率按品质系数缩放并受保底修正
  const factor = qualityCoefficient / 100;
  let pSix = 0.01 * factor;
  let pFive = 0.04 * factor;
  let pFour = 0.10 * factor;
  let pThree = 0.25 * factor;
  let pAbnormal = 0.002 * (conditions.altitude === 'snowline' && conditions.soil === 'rock' ? 2.5 : 1);

  const gradeProbabilities: Record<WalnutGrade, number> = {
    six_ridges: pSix,
    five_ridges: pFive,
    four_ridges: pFour,
    three_ridges: pThree,
    abnormal: pAbnormal,
    common: Math.max(0, 1 - (pSix + pFive + pFour + pThree + pAbnormal))
  };

  return {
    matchingScore,
    qualityCoefficient,
    guaranteedGrade,
    scores: {
      altitude: altScore,
      soil: soilScore,
      humidity: humScore,
      temperature: tempScore,
      light: lightScore,
      water: waterScore,
      fertilizer: fertScore
    },
    effectiveConditions: {
      altitude: conditions.altitude,
      soil: conditions.soil,
      humidity: effHumidity,
      temperature: effTemperature,
      light: effLight,
      water: conditions.waterSource,
      fertilizer: conditions.fertilizer
    },
    gradeProbabilities
  };
}
