import { SkillNode } from '../types';

export const INITIAL_SKILLS: SkillNode[] = [
  {
    branch: 'breeding',
    name: '神农育种',
    description: '深谙草木嫁接与良种驯化之道。',
    level: 0,
    maxLevel: 5,
    effectDesc: '每升1级：种子购买花费 −8%，台地环境匹配度基础加成 +3 分。',
    costPoints: 10
  },
  {
    branch: 'cracking',
    name: '鲁班巧劲',
    description: '开核时劲道精准，最大程度护佑外壳不伤分毫。',
    level: 0,
    maxLevel: 5,
    effectDesc: '每升1级：开核破损率 −8%（5级减少40%），出核完整度保形率提升。',
    costPoints: 10
  },
  {
    branch: 'appraisal',
    name: '火眼金睛',
    description: '辨骨识皮，提前洞悉未开核桃之机理。',
    level: 0,
    maxLevel: 5,
    effectDesc: '每升1级：鉴定铜钱花费 −10%，可在未开青皮上隐约预判棱数与变异趋势。',
    costPoints: 10
  },
  {
    branch: 'restoration',
    name: '古物天工',
    description: '掌握历代古画揭裱、青铜去锈与核桃上光绝技。',
    level: 0,
    maxLevel: 5,
    effectDesc: '每升1级：藏品修复保养速度与效果提升 +15%，核桃盘玩包浆提速 +20%。',
    costPoints: 10
  },
  {
    branch: 'management',
    name: '富甲商道',
    description: '长袖善舞，精通交易行与拍卖会的博弈算度。',
    level: 0,
    maxLevel: 5,
    effectDesc: '每升1级：交易行中介抽成 −8%，拍卖会流拍托底手续费大幅减免。',
    costPoints: 10
  }
];
