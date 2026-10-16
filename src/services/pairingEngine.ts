import { WalnutItem, PairingResult } from '../types';

export function calculatePairing(w1: WalnutItem, w2: WalnutItem): PairingResult {
  // 必须是已经开核的
  if (w1.isUncracked || w2.isUncracked) {
    return {
      score: 0,
      isSuccess: false,
      isPerfect: false,
      dimensions: { size: 0, posture: 0, pattern: 0, skin: 0, ridges: 0 },
      commentary: '尚未开核，无法品评配对。',
      boxValueMultiplier: 1.0
    };
  }

  // 1. 尺寸维度计算 (权重 25%)
  const edgeDiff = Math.abs((w1.edgeWidth || 40) - (w2.edgeWidth || 40));
  const bellyDiff = Math.abs((w1.bellyWidth || 40) - (w2.bellyWidth || 40));
  const heightDiff = Math.abs((w1.height || 38) - (w2.height || 38));
  const maxDiff = Math.max(edgeDiff, bellyDiff, heightDiff);

  let sizeScore = 100;
  if (maxDiff <= 0.3) sizeScore = 100;
  else if (maxDiff <= 0.6) sizeScore = 95;
  else if (maxDiff <= 1.0) sizeScore = 88;
  else if (maxDiff <= 1.5) sizeScore = 78;
  else if (maxDiff <= 2.2) sizeScore = 60;
  else if (maxDiff <= 3.0) sizeScore = 40;
  else sizeScore = 15;

  // 2. 桩型维度计算 (权重 20%)
  let postureScore = 40;
  if (w1.posture === w2.posture) {
    postureScore = 100;
  } else if (
    (w1.posture === 'standard' && w2.posture === 'low') ||
    (w1.posture === 'low' && w2.posture === 'standard')
  ) {
    postureScore = 70;
  } else if (
    (w1.posture === 'standard' && w2.posture === 'high') ||
    (w1.posture === 'high' && w2.posture === 'standard')
  ) {
    postureScore = 65;
  } else {
    postureScore = 30;
  }

  // 3. 纹路维度计算 (权重 25%)
  let patternScore = 35;
  if (w1.pattern === w2.pattern) {
    patternScore = 100;
  } else if (
    (w1.pattern === 'flowing_water' && w2.pattern === 'fine_mesh') ||
    (w1.pattern === 'fine_mesh' && w2.pattern === 'flowing_water') ||
    (w1.pattern === 'deep_concave' && w2.pattern === 'dense_web') ||
    (w1.pattern === 'dense_web' && w2.pattern === 'deep_concave')
  ) {
    patternScore = 72;
  } else {
    patternScore = 40;
  }

  // 4. 皮质与色泽维度 (权重 15%)
  let skinScore = 50;
  if (w1.skinColor === w2.skinColor) {
    skinScore = 100;
  } else if (
    (w1.skinColor === 'ginger_yellow' && w2.skinColor === 'cooked_brown') ||
    (w1.skinColor === 'cooked_brown' && w2.skinColor === 'ginger_yellow') ||
    (w1.skinColor === 'cooked_brown' && w2.skinColor === 'oxford_red') ||
    (w1.skinColor === 'oxford_red' && w2.skinColor === 'cooked_brown')
  ) {
    skinScore = 75;
  } else {
    skinScore = 40;
  }

  // 5. 棱数维度 (权重 15%) - 异棱一致性是文玩硬性指标
  let ridgeScore = 0;
  if (w1.ridges === w2.ridges) {
    ridgeScore = 100;
  } else {
    // 棱数不同严厉归零
    ridgeScore = 0;
  }

  // 综合配对度计算
  const finalScore = Math.round(
    sizeScore * 0.25 +
    postureScore * 0.20 +
    patternScore * 0.25 +
    skinScore * 0.15 +
    ridgeScore * 0.15
  );

  const ridgesMatch = w1.ridges === w2.ridges;
  const isPerfect = finalScore >= 95 && ridgesMatch;
  const isSuccess = finalScore >= 85 && ridgesMatch;

  let commentary = '';
  let boxValueMultiplier = 1.0;

  if (isPerfect) {
    commentary = '【天造地设】两核尺寸分毫不差，同桩同纹同骨色，若孪生兄妹，当世绝品！';
    boxValueMultiplier = 4.0;
  } else if (isSuccess) {
    commentary = '【成双成对】骨架协调，步调一致，纹理交相辉映，实乃收藏家梦寐以求之对核！';
    boxValueMultiplier = 2.5;
  } else if (finalScore >= 70) {
    commentary = '【貌合神离】尺寸大体相仿，但在纹路细节或桩型上仍有瑕疵，差之毫厘。';
    boxValueMultiplier = 1.4;
  } else {
    commentary = '【各行其道】二者身量各异或棱数不匹，强行配对恐贻笑大方。';
    boxValueMultiplier = 1.0;
  }

  return {
    score: finalScore,
    isSuccess,
    isPerfect,
    dimensions: {
      size: sizeScore,
      posture: postureScore,
      pattern: patternScore,
      skin: skinScore,
      ridges: ridgeScore
    },
    commentary,
    boxValueMultiplier
  };
}
