import { SolarTerm } from '../types';

export const SOLAR_TERMS: SolarTerm[] = [
  // 春季
  {
    index: 0,
    name: '立春',
    season: 'spring',
    seasonName: '春',
    tempDelta: -1,
    humidityDelta: 1,
    lightDelta: 0,
    features: '大地解冻返潮，适宜初次催芽破土。'
  },
  {
    index: 1,
    name: '雨水',
    season: 'spring',
    seasonName: '春',
    tempDelta: -1,
    humidityDelta: 1,
    lightDelta: 0,
    features: '春雨润物无声，台地湿度普遍回升。'
  },
  {
    index: 2,
    name: '惊蛰',
    season: 'spring',
    seasonName: '春',
    tempDelta: 0,
    humidityDelta: 0,
    lightDelta: 0,
    features: '春雷萌动，温和平衡，全品种适生平稳期。'
  },
  {
    index: 3,
    name: '春分',
    season: 'spring',
    seasonName: '春',
    tempDelta: 0,
    humidityDelta: 0,
    lightDelta: 0,
    features: '昼夜均分，万物拔节，稳扎稳打育种最佳。'
  },
  {
    index: 4,
    name: '清明',
    season: 'spring',
    seasonName: '春',
    tempDelta: 1,
    humidityDelta: 2,
    lightDelta: 0,
    features: '雨水连绵，膨大极快，但纹理容易偏浅。',
    limitedVarietyId: 'rain_fine'
  },
  {
    index: 5,
    name: '谷雨',
    season: 'spring',
    seasonName: '春',
    tempDelta: 1,
    humidityDelta: 2,
    lightDelta: 0,
    features: '谷雨催细纹，正是培植「雨前细纹」的绝佳窗口。',
    limitedVarietyId: 'rain_fine'
  },

  // 夏季
  {
    index: 6,
    name: '立夏',
    season: 'summer',
    seasonName: '夏',
    tempDelta: 2,
    humidityDelta: 1,
    lightDelta: 1,
    features: '温度骤升，核树生长提速，皮质偏软。'
  },
  {
    index: 7,
    name: '小满',
    season: 'summer',
    seasonName: '夏',
    tempDelta: 2,
    humidityDelta: 1,
    lightDelta: 1,
    features: '日光渐烈，水汽丰沛，果壳快速硬质化。'
  },
  {
    index: 8,
    name: '芒种',
    season: 'summer',
    seasonName: '夏',
    tempDelta: 2,
    humidityDelta: 0,
    lightDelta: 2,
    features: '强日照来临，青皮开始分泌树脂，上色最盛。'
  },
  {
    index: 9,
    name: '夏至',
    season: 'summer',
    seasonName: '夏',
    tempDelta: 2,
    humidityDelta: 0,
    lightDelta: 2,
    features: '至阳之日，全日照加倍，油性凝聚的最佳时段。'
  },
  {
    index: 10,
    name: '小暑',
    season: 'summer',
    seasonName: '夏',
    tempDelta: 2,
    humidityDelta: -2,
    lightDelta: 2,
    features: '干旱伏天，空气极干，纹路如刀劈斧削最深。',
    limitedVarietyId: 'drought_iron'
  },
  {
    index: 11,
    name: '大暑',
    season: 'summer',
    seasonName: '夏',
    tempDelta: 2,
    humidityDelta: -2,
    lightDelta: 2,
    features: '酷热如蒸，铁皮核桃淬炼大成的最后时机。',
    limitedVarietyId: 'drought_iron'
  },

  // 秋季
  {
    index: 12,
    name: '立秋',
    season: 'autumn',
    seasonName: '秋',
    tempDelta: 1,
    humidityDelta: 0,
    lightDelta: 0,
    features: '微风渐爽，果壳开始彻底硬化紧实。'
  },
  {
    index: 13,
    name: '处暑',
    season: 'autumn',
    seasonName: '秋',
    tempDelta: 1,
    humidityDelta: 0,
    lightDelta: 0,
    features: '暑气渐退，核仁饱满结实，落定桩型。'
  },
  {
    index: 14,
    name: '白露',
    season: 'autumn',
    seasonName: '秋',
    tempDelta: 0,
    humidityDelta: -1,
    lightDelta: 0,
    features: '白露核桃下树！全年采摘黄金高峰，大果争锋。',
    limitedVarietyId: 'dew_giant'
  },
  {
    index: 15,
    name: '秋分',
    season: 'autumn',
    seasonName: '秋',
    tempDelta: 0,
    humidityDelta: -1,
    lightDelta: 0,
    features: '秋色平分，果熟蒂落，交易行供求极为活跃。',
    limitedVarietyId: 'dew_giant'
  },
  {
    index: 16,
    name: '寒露',
    season: 'autumn',
    seasonName: '秋',
    tempDelta: -1,
    humidityDelta: -1,
    lightDelta: 0,
    features: '露冷寒意，最易沉淀厚皮与苍劲深纹。'
  },
  {
    index: 17,
    name: '霜降',
    season: 'autumn',
    seasonName: '秋',
    tempDelta: -1,
    humidityDelta: -1,
    lightDelta: 0,
    features: '清霜覆盖，高品质厚皮最后的一波晚收。'
  },

  // 冬季
  {
    index: 18,
    name: '立冬',
    season: 'winter',
    seasonName: '冬',
    tempDelta: -2,
    humidityDelta: 0,
    lightDelta: -1,
    features: '水始冰，地始冻，寻常品种生长停滞入眠。'
  },
  {
    index: 19,
    name: '小雪',
    season: 'winter',
    seasonName: '冬',
    tempDelta: -2,
    humidityDelta: 0,
    lightDelta: -1,
    features: '初雪飘零，唯耐寒名品尚能微量结实。'
  },
  {
    index: 20,
    name: '大雪',
    season: 'winter',
    seasonName: '冬',
    tempDelta: -2,
    humidityDelta: 0,
    lightDelta: -2,
    features: '飞雪漫天，只适宜高海拔抗冻奇种。'
  },
  {
    index: 21,
    name: '冬至',
    season: 'winter',
    seasonName: '冬',
    tempDelta: -2,
    humidityDelta: 0,
    lightDelta: -2,
    features: '夜长天冷，高山雪线蓄积纯净雪水。'
  },
  {
    index: 22,
    name: '小寒',
    season: 'winter',
    seasonName: '冬',
    tempDelta: -2,
    humidityDelta: -2,
    lightDelta: -1,
    features: '严寒干燥雪水丰沛，岩生异棱冲刺五棱六棱的最佳窗口！',
    limitedVarietyId: 'snow_ridge'
  },
  {
    index: 23,
    name: '大寒',
    season: 'winter',
    seasonName: '冬',
    tempDelta: -2,
    humidityDelta: -2,
    lightDelta: -1,
    features: '岁末严寒，天降奇珍，传说级异品现身机率大增。',
    limitedVarietyId: 'snow_ridge'
  }
];
