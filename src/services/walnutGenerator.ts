import { WalnutItem, WalnutGrade, WalnutPosture, WalnutPattern, WalnutSkin, AppraisalLevel } from '../types';
import { ClimateEvaluation } from './climateEngine';
import { VARIETIES_MAP } from '../config/varietiesData';

export const GRADE_NAMES: Record<WalnutGrade, string> = {
  common: '普核 · 两棱',
  three_ridges: '良品 · 三棱',
  four_ridges: '罕品 · 四棱',
  five_ridges: '极品 · 五棱',
  six_ridges: '神品 · 六棱及以上',
  abnormal: '传说 · 造化异品'
};

export const POSTURE_NAMES: Record<WalnutPosture, string> = {
  standard: '正桩 · 端庄中正',
  low: '矮桩 · 敦厚压手',
  high: '高桩 · 气势昂扬',
  abnormal: '异桩 · 奇绝天然'
};

export const PATTERN_NAMES: Record<WalnutPattern, string> = {
  flowing_water: '流水纹 · 舒展绵延',
  deep_concave: '深凹纹 · 苍劲古朴',
  fine_mesh: '细网纹 · 玲珑缜密',
  dense_web: '密网纹 · 鳞次栉比',
  beast_face: '兽面纹 · 威严霸道',
  cloud_dragon: '云龙纹 · 吞云吐雾'
};

export const SKIN_NAMES: Record<WalnutSkin, string> = {
  white_rough: '白茬 · 新剥初生',
  ginger_yellow: '姜黄 · 骨质初显',
  cooked_brown: '熟褐 · 岁月沉淀',
  oxford_red: '牛津红 · 油润晶莹',
  jade_glow: '玉化红 · 通透如玉'
};

export function generateRawWalnut(
  terraceName: string,
  varietyId: string,
  climateEval: ClimateEvaluation
): WalnutItem {
  const variety = VARIETIES_MAP.get(varietyId);
  const vName = variety ? variety.name : '山核桃';
  const id = 'wn_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

  // 估测尺寸与重量
  const baseSize = varietyId === 'dew_giant' ? 46 : 41;
  const rawSizeMm = Math.round((baseSize + (Math.random() * 6 - 3)) * 10) / 10;
  const rawWeightG = Math.round((22 + (rawSizeMm - 38) * 1.2 + Math.random() * 3) * 10) / 10;

  // 预判文字
  let estimate = '青皮厚实，上手微沉，纹理未明。';
  if (climateEval.guaranteedGrade === 'five_ridges' || climateEval.guaranteedGrade === 'six_ridges') {
    estimate = '青皮紧绷似铁，底脐隐见多星芒，极大概率蕴藏绝世异棱！';
  } else if (climateEval.guaranteedGrade === 'four_ridges') {
    estimate = '果型周正方阔，隐隐透出四棱之势，筋骨不凡。';
  } else if (climateEval.guaranteedGrade === 'three_ridges') {
    estimate = '果肩饱满，三足鼎立之兆初显。';
  }

  return {
    id,
    name: `未开青皮 · ${vName}`,
    varietyId,
    varietyName: vName,
    isUncracked: true,
    rawSizeMm,
    rawWeightG,
    estimatePreview: estimate,
    estimatedValue: Math.round(50 + climateEval.qualityCoefficient * 2)
  };
}

export type CrackingTool = 'hammer' | 'clamp' | 'pick';

export function crackWalnut(
  rawWalnut: WalnutItem,
  climateEval: ClimateEvaluation,
  tool: CrackingTool = 'hammer',
  crackingSkillLevel: number = 0
): WalnutItem {
  // 1. 确定最终等级（保底与概率判定）
  const probs = climateEval.gradeProbabilities;
  const guaranteed = climateEval.guaranteedGrade;

  let chosenGrade: WalnutGrade = guaranteed;
  const roll = Math.random();

  // 异品纯随机判断
  if (roll < probs.abnormal) {
    chosenGrade = 'abnormal';
  } else if (roll < probs.abnormal + probs.six_ridges) {
    chosenGrade = 'six_ridges';
  } else if (roll < probs.abnormal + probs.six_ridges + probs.five_ridges) {
    if (chosenGrade !== 'six_ridges') chosenGrade = 'five_ridges';
  } else if (roll < probs.abnormal + probs.six_ridges + probs.five_ridges + probs.four_ridges) {
    if (chosenGrade === 'common' || chosenGrade === 'three_ridges') chosenGrade = 'four_ridges';
  } else if (roll < probs.abnormal + probs.six_ridges + probs.five_ridges + probs.four_ridges + probs.three_ridges) {
    if (chosenGrade === 'common') chosenGrade = 'three_ridges';
  }

  // 棱数
  let ridges = 2;
  if (chosenGrade === 'three_ridges') ridges = 3;
  if (chosenGrade === 'four_ridges') ridges = 4;
  if (chosenGrade === 'five_ridges') ridges = 5;
  if (chosenGrade === 'six_ridges') ridges = Math.random() < 0.2 ? 8 : 6;
  if (chosenGrade === 'abnormal') ridges = 2; // 连体异形

  // 2. 物理尺寸与重量
  const baseDim = rawWalnut.rawSizeMm || 42;
  const edgeWidth = Math.round((baseDim + (Math.random() * 2 - 1)) * 10) / 10;
  const bellyWidth = Math.round((edgeWidth * (0.95 + Math.random() * 0.08)) * 10) / 10;
  const height = Math.round((edgeWidth * (0.90 + Math.random() * 0.12)) * 10) / 10;
  const weight = Math.round(((edgeWidth * bellyWidth * height) / 2500 + Math.random() * 2) * 10) / 10;

  // 3. 桩型判定
  let posture: WalnutPosture = 'standard';
  const ratio = height / edgeWidth;
  if (chosenGrade === 'abnormal') {
    posture = 'abnormal';
  } else if (ratio < 0.92) {
    posture = 'low'; // 矮桩
  } else if (ratio > 1.02) {
    posture = 'high'; // 高桩
  }

  // 4. 纹路判定
  const patterns: WalnutPattern[] = [
    'flowing_water',
    'deep_concave',
    'fine_mesh',
    'dense_web',
    'beast_face',
    'cloud_dragon'
  ];
  let pattern = patterns[Math.floor(Math.random() * patterns.length)];
  if (rawWalnut.varietyId === 'stream_fine' || rawWalnut.varietyId === 'rain_fine') {
    pattern = Math.random() < 0.6 ? 'fine_mesh' : 'flowing_water';
  } else if (rawWalnut.varietyId === 'rock_ridge' || rawWalnut.varietyId === 'snow_ridge') {
    pattern = Math.random() < 0.5 ? 'beast_face' : 'deep_concave';
  }

  // 5. 皮色与油润
  const skins: WalnutSkin[] = ['white_rough', 'ginger_yellow', 'cooked_brown', 'oxford_red'];
  let skinColor: WalnutSkin = 'ginger_yellow';
  if (climateEval.scores.light >= 80) {
    skinColor = Math.random() < 0.5 ? 'oxford_red' : 'cooked_brown';
  } else {
    skinColor = skins[Math.floor(Math.random() * 2)];
  }

  // 6. 工具与完整度计算
  let baseIntegrity = 92;
  if (tool === 'hammer') baseIntegrity = 94 + Math.floor(Math.random() * 5);
  if (tool === 'clamp') baseIntegrity = 86 + Math.floor(Math.random() * 10);
  if (tool === 'pick') baseIntegrity = 96 + Math.floor(Math.random() * 4);

  // 技能加成
  const integrity = Math.min(100, baseIntegrity + crackingSkillLevel * 2);

  // 7. 品相综合打分 (0-100)
  // 尺寸权重20%, 桩型20%, 纹路25%, 皮质20%, 基础棱数15%
  const sizeScore = Math.min(100, Math.max(50, (edgeWidth - 36) * 7));
  const postureScore = posture === 'standard' || posture === 'low' ? 95 : 80;
  const patternScore = pattern === 'beast_face' || pattern === 'cloud_dragon' ? 98 : 85;
  const skinScore = skinColor === 'oxford_red' ? 96 : skinColor === 'cooked_brown' ? 88 : 75;
  const ridgeScore = ridges >= 6 ? 100 : ridges === 5 ? 95 : ridges === 4 ? 85 : ridges === 3 ? 75 : 60;

  const totalAppraisalScore = Math.round(
    sizeScore * 0.20 +
    postureScore * 0.20 +
    patternScore * 0.25 +
    skinScore * 0.20 +
    ridgeScore * 0.15
  );

  let appraisalLevel: AppraisalLevel = 'ordinary';
  if (totalAppraisalScore >= 95) appraisalLevel = 'divine';
  else if (totalAppraisalScore >= 88) appraisalLevel = 'precious';
  else if (totalAppraisalScore >= 75) appraisalLevel = 'superior';
  else if (totalAppraisalScore >= 60) appraisalLevel = 'good';

  // 价值评估
  let baseValue = 50;
  if (chosenGrade === 'three_ridges') baseValue = 220;
  if (chosenGrade === 'four_ridges') baseValue = 850;
  if (chosenGrade === 'five_ridges') baseValue = 2800;
  if (chosenGrade === 'six_ridges') baseValue = 9000;
  if (chosenGrade === 'abnormal') baseValue = 18000;

  const appraisalMultiplier =
    appraisalLevel === 'divine' ? 2.0 :
    appraisalLevel === 'precious' ? 1.5 :
    appraisalLevel === 'superior' ? 1.25 :
    appraisalLevel === 'good' ? 1.1 : 1.0;

  const integrityMultiplier = integrity / 100;
  const finalValue = Math.round(baseValue * appraisalMultiplier * integrityMultiplier * (edgeWidth / 40));

  return {
    ...rawWalnut,
    isUncracked: false,
    name: `${GRADE_NAMES[chosenGrade].split('·')[1].trim()} · ${rawWalnut.varietyName}`,
    grade: chosenGrade,
    gradeName: GRADE_NAMES[chosenGrade],
    ridges,
    edgeWidth,
    bellyWidth,
    height,
    weight,
    posture,
    postureName: POSTURE_NAMES[posture],
    pattern,
    patternName: PATTERN_NAMES[pattern],
    skinColor,
    skinColorName: SKIN_NAMES[skinColor],
    density: Math.round(70 + Math.random() * 28),
    oiliness: Math.round(65 + Math.random() * 32),
    integrity,
    patinaLevel: 0,
    playCount: 0,
    appraisalScore: totalAppraisalScore,
    appraisalLevel,
    hasCertificate: false,
    estimatedValue: finalValue
  };
}
