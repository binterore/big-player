import { Variety } from '../types';

export const VARIETIES: Variety[] = [
  {
    id: 'plain_big',
    name: '平原大果',
    description: '产于低矮平原丘陵，果型周正饱满，生长迅速，产量可观，为初入行者最稳妥的立足品种。',
    preferredAltitude: ['lowland', 'hills'],
    preferredSoil: ['loam', 'clay'],
    idealHumidity: 'humid',
    idealTemperature: 'warm',
    idealLight: 'full',
    preferredWater: 'rain',
    seedPrice: 80,
    growTimeSeconds: 15, // 快速节奏以便玩家沉浸体验
    contradictionDesc: '湿润与温暖促进膨大，但皮壳油性稍逊，极少产出深密大纹。'
  },
  {
    id: 'mountain_thick',
    name: '高山厚皮',
    description: '扎根于千米以上高山迎风面，皮质坚硬如铁，分量压手，盘玩上色如熟透蜜蜡，包浆极佳。',
    preferredAltitude: ['mountain', 'snowline'],
    preferredSoil: ['sand', 'rock'],
    idealHumidity: 'moderate',
    idealTemperature: 'cold',
    idealLight: 'full',
    preferredWater: 'snow',
    seedPrice: 240,
    growTimeSeconds: 25,
    contradictionDesc: '冷凉环境保证了高密度与厚皮质，但严重限制膨大速度，难出45mm以上大尺寸。'
  },
  {
    id: 'rock_ridge',
    name: '岩生异棱',
    description: '生于悬崖峭壁的石缝之间，受高山烈风与昼夜剧烈温差撕扯，最易变异出多棱与奇绝异桩。',
    preferredAltitude: ['mountain', 'snowline'],
    preferredSoil: ['rock'],
    idealHumidity: 'dry',
    idealTemperature: 'cold',
    idealLight: 'strong',
    preferredWater: 'spring',
    seedPrice: 600,
    growTimeSeconds: 40,
    contradictionDesc: '极度偏好干旱与冷凉，稍有高湿高温便会退化为普通两棱，极考种植调控手艺。'
  },
  {
    id: 'stream_fine',
    name: '溪畔细纹',
    description: '临清溪而生，终年受水雾与半日照滋养，纹路如行云流水、纤细深邃，天生适合配对成双。',
    preferredAltitude: ['hills', 'mountain'],
    preferredSoil: ['sand', 'loam'],
    idealHumidity: 'humid',
    idealTemperature: 'mild',
    idealLight: 'partial',
    preferredWater: 'stream',
    seedPrice: 350,
    growTimeSeconds: 20,
    contradictionDesc: '水汽丰沛造就绝美细纹，但若遇强日照暴晒，外皮易生暗斑裂隙。'
  },
  // 节气限定品种
  {
    id: 'rain_fine',
    name: '雨前细纹',
    description: '【清明/谷雨限定】汲取春雨之灵气，纹路规整细腻宛若天成，配对成功率居全品种之冠。',
    isSeasonLimited: true,
    seasonName: '清明/谷雨',
    preferredAltitude: ['hills', 'mountain'],
    preferredSoil: ['loam'],
    idealHumidity: 'very_humid',
    idealTemperature: 'mild',
    idealLight: 'partial',
    preferredWater: 'rain',
    seedPrice: 500,
    growTimeSeconds: 30,
    contradictionDesc: '必须在多雨潮湿期播种，错过当季环境将难以激发其独特的清灵细纹。'
  },
  {
    id: 'drought_iron',
    name: '旱生铁皮',
    description: '【小暑/大暑限定】经受炎夏烈日淬炼，果壳密度达到文玩核桃巅峰，硬逾钢铁，敲击金石有声。',
    isSeasonLimited: true,
    seasonName: '小暑/大暑',
    preferredAltitude: ['mountain'],
    preferredSoil: ['sand', 'rock'],
    idealHumidity: 'dry',
    idealTemperature: 'hot',
    idealLight: 'strong',
    preferredWater: 'spring',
    seedPrice: 650,
    growTimeSeconds: 35,
    contradictionDesc: '酷暑炎热造就极致硬度，但若供水稍多，果皮立即变脆易裂。'
  },
  {
    id: 'dew_giant',
    name: '白露大果',
    description: '【白露/秋分限定】白露凝霜下树采摘，尺寸硕大无朋，通体金黄圆润，为普核里万人争抢的顶流。',
    isSeasonLimited: true,
    seasonName: '白露/秋分',
    preferredAltitude: ['lowland', 'hills'],
    preferredSoil: ['loam'],
    idealHumidity: 'moderate',
    idealTemperature: 'mild',
    idealLight: 'full',
    preferredWater: 'rain',
    seedPrice: 700,
    growTimeSeconds: 30,
    contradictionDesc: '尺寸虽大，但因其骨架舒展，想要出四棱以上的变异概率极低。'
  },
  {
    id: 'snow_ridge',
    name: '雪线异棱',
    description: '【小寒/大寒限定】傲雪凌霜的高寒奇珍，是孕育五棱、六棱与传说级异品的最稳定源头。',
    isSeasonLimited: true,
    seasonName: '小寒/大寒',
    preferredAltitude: ['snowline'],
    preferredSoil: ['rock'],
    idealHumidity: 'dry',
    idealTemperature: 'cold',
    idealLight: 'strong',
    preferredWater: 'snow',
    seedPrice: 1200,
    growTimeSeconds: 45,
    contradictionDesc: '非雪线严寒与雪水不可激发生机，稍有暖意便结核停滞。'
  }
];

export const VARIETIES_MAP = new Map(VARIETIES.map(v => [v.id, v]));
