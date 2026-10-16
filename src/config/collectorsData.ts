import { Collector, CollectorExchange, CollectorLetter } from '../types';

export const COLLECTORS: Collector[] = [
  {
    id: 'old_ink',
    name: '老砚台',
    title: '文房墨客 · 翰林宿老',
    avatar: '🖋️',
    obsession: '唯爱金石碑帖与紫金古砚，最重文人气韵。',
    preferenceDesc: '喜爱【四棱及以上】且纹路规整、端庄肃穆的方正核桃。',
    favor: 10,
    unlocked: true
  },
  {
    id: 'sword_master',
    name: '铸剑翁',
    title: '欧冶流派 · 塞外剑痴',
    avatar: '🗡️',
    obsession: '走遍天下古战场，只为寻找能与神剑争锋之造化奇物。',
    preferenceDesc: '只收【高山或雪线】孕育出的【五棱及以上】风骨奇核。',
    favor: 0,
    unlocked: true
  },
  {
    id: 'porcelain_lover',
    name: '瓷痴',
    title: '御窑世家 · 胎骨辨微',
    avatar: '🏺',
    obsession: '眼底容不下半分瑕疵，视成双成对之器为天道完美。',
    preferenceDesc: '唯收【成功配对（配对度 ≥ 85%）】的成对文玩锦盒。',
    favor: 0,
    unlocked: true
  },
  {
    id: 'western_guest',
    name: '西洋客',
    title: '海舶巨贾 · 猎奇藏家',
    avatar: '🧭',
    obsession: '对东方神秘自然造化叹为观止，偏爱奇特、宏伟之物。',
    preferenceDesc: '不问品种，但求【肚径 ≥ 46mm 超大果】或【连体奇形异品】。',
    favor: 0,
    unlocked: true
  },
  {
    id: 'old_friend',
    name: '园主旧友',
    title: '老庄邻里 · 祖父故交',
    avatar: '🍵',
    obsession: '感念旧情，常来坐坐，愿看这片荒废核桃园重现生机。',
    preferenceDesc: '无论两棱普核或残次果均收，愿为你提供稀有良种与土地养料。',
    favor: 30,
    unlocked: true
  }
];

export const INITIAL_EXCHANGES: CollectorExchange[] = [
  // 园主旧友初级委托
  {
    id: 'ex_old_friend_1',
    collectorId: 'old_friend',
    targetAntiqueId: 'curio_xuande',
    title: '【归还遗珍】宣德桥耳炉',
    reqDesc: '提供任意 3 颗两棱普核（无论品相），旧友愿将祖父旧炉送还。',
    isCompleted: false,
    reqMinRidges: 2
  },
  {
    id: 'ex_old_friend_2',
    collectorId: 'old_friend',
    targetAntiqueId: 'rare_agarwood',
    title: '【祖父手植】奇楠沉香达摩',
    reqDesc: '提供 1 颗三棱及以上核桃，证明你已掌握种植精髓。',
    isCompleted: false,
    reqMinRidges: 3
  },

  // 老砚台的书画委托
  {
    id: 'ex_old_ink_1',
    collectorId: 'old_ink',
    targetAntiqueId: 'art_kuaixue',
    title: '【方正若印】快雪时晴帖',
    reqDesc: '提供 1 颗【四棱】且纹路端正的核桃。',
    isCompleted: false,
    reqMinRidges: 4
  },
  {
    id: 'ex_old_ink_2',
    collectorId: 'old_ink',
    targetAntiqueId: 'art_shusu',
    title: '【墨气纵横】米芾蜀素帖',
    reqDesc: '提供 1 颗【四棱或五棱】且品相达【上品】的精品核桃。',
    isCompleted: false,
    reqMinRidges: 4
  },
  {
    id: 'ex_old_ink_3',
    collectorId: 'old_ink',
    targetAntiqueId: 'art_youchun',
    title: '【青绿春水】展子虔游春图',
    reqDesc: '提供 1 颗【五棱】珍品核桃，以证造化之妙。',
    isCompleted: false,
    reqMinRidges: 5
  },

  // 铸剑翁的名剑委托
  {
    id: 'ex_sword_1',
    collectorId: 'sword_master',
    targetAntiqueId: 'sword_huanshou',
    title: '【塞外金戈】汉代环首刀',
    reqDesc: '提供 1 颗【高山厚皮】产出的三棱及以上核桃。',
    isCompleted: false,
    reqMinRidges: 3,
    reqAltitudeOrigin: 'mountain'
  },
  {
    id: 'ex_sword_2',
    collectorId: 'sword_master',
    targetAntiqueId: 'sword_longquan',
    title: '【七星龙吟】龙泉古剑',
    reqDesc: '提供 1 颗【四棱及以上】坚实硬核。',
    isCompleted: false,
    reqMinRidges: 4
  },
  {
    id: 'ex_sword_3',
    collectorId: 'sword_master',
    targetAntiqueId: 'sword_goujian',
    title: '【天下第一剑】越王青铜剑',
    reqDesc: '提供 1 颗【雪线/高山】产出的【五棱或六棱】极品核桃！',
    isCompleted: false,
    reqMinRidges: 5,
    reqAltitudeOrigin: 'snowline'
  },

  // 瓷痴的配对委托
  {
    id: 'ex_porcelain_1',
    collectorId: 'porcelain_lover',
    targetAntiqueId: 'curio_meiping',
    title: '【天成一双】元青花梅瓶',
    reqDesc: '提供 1 对【已装盒配对核桃】（配对度 ≥ 85%）。',
    isCompleted: false,
    reqMustBePair: true,
    reqMinPairingScore: 85
  },
  {
    id: 'ex_porcelain_2',
    collectorId: 'porcelain_lover',
    targetAntiqueId: 'curio_jigang',
    title: '【成双成对】成化斗彩鸡缸杯',
    reqDesc: '提供 1 对【三棱或正桩】完美配对核桃（配对度 ≥ 90%）。',
    isCompleted: false,
    reqMustBePair: true,
    reqMinPairingScore: 90
  },
  {
    id: 'ex_porcelain_3',
    collectorId: 'porcelain_lover',
    targetAntiqueId: 'curio_ruyao',
    title: '【雨过天青】宋汝窑弦纹樽',
    reqDesc: '提供 1 对【天造地设（配对度 ≥ 95%）】绝品配对锦盒！',
    isCompleted: false,
    reqMustBePair: true,
    reqMinPairingScore: 95
  },

  // 西洋客的霸王委托
  {
    id: 'ex_western_1',
    collectorId: 'western_guest',
    targetAntiqueId: 'sword_damascus',
    title: '【大漠奇兵】镔铁回纹刀',
    reqDesc: '提供 1 颗【边宽 ≥ 45mm】的壮硕大果。',
    isCompleted: false,
    reqMinSizeMm: 45
  },
  {
    id: 'ex_western_2',
    collectorId: 'western_guest',
    targetAntiqueId: 'rare_watch',
    title: '【黄金机械】日内瓦金怀表',
    reqDesc: '提供 1 颗【边宽 ≥ 47mm】或【异品/六棱】核桃。',
    isCompleted: false,
    reqMinSizeMm: 47
  },
  {
    id: 'ex_western_3',
    collectorId: 'western_guest',
    targetAntiqueId: 'rare_emerald',
    title: '【翠色天晶】帝王绿满翠佩',
    reqDesc: '提供 1 颗传说中的【异品】或【六棱及以上】神品核桃！',
    isCompleted: false,
    reqMinRidges: 6
  }
];

export const INITIAL_LETTERS: CollectorLetter[] = [
  {
    id: 'letter_welcome',
    collectorId: 'old_friend',
    collectorName: '园主旧友',
    title: '见字如晤：承继祖业之喜',
    type: 'narrative',
    content: '贤侄，得知你接下了南山这片荒芜多年的核桃园，老夫欣慰至极。你祖父当年一手调弄水土的绝活名扬十里。记住：种核先看地，地选对了，核才生得端正！附上铜板两百文与祖传良种，且去开辟你的第一方台地吧。',
    date: '春始',
    rewardClaimed: false,
    rewardDesc: '获得启程金币 300 文，平原大果种子 ×3',
    rewardCoins: 300,
    replyOptions: [
      { text: '多谢伯父关怀，定不负祖父遗愿！', favorDelta: 10, response: '好！有骨气，老夫静候你的捷报。' },
      { text: '这荒山野岭，不知何时才能收成。', favorDelta: 5, response: '莫急，草木有灵，顺天应时便可成材。' }
    ]
  },
  {
    id: 'letter_ink_intro',
    collectorId: 'old_ink',
    collectorName: '老砚台',
    title: '闻有新人开园，寄语方圆之道',
    type: 'clue',
    content: '听闻山庄重开，老朽特修书一封。老朽平生不逐俗流，唯喜四棱周正之核。世人皆以为多棱乃天幸，实则高山高燥、辅以烈日与硼肥，方是催生异棱的真法门。若有此物，老朽书斋藏卷任君挑选。',
    date: '惊蛰',
    rewardClaimed: false,
    rewardDesc: '获得技艺点 +10',
    replyOptions: [
      { text: '晚辈谨记老先生指点，必以四棱相敬。', favorDelta: 15, response: '善哉！孺子可教，老朽拭目以待。' },
      { text: '四棱异形极难培育，尽力而为。', favorDelta: 8, response: '无妨，知难方显功夫深。' }
    ]
  }
];
