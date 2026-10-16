import { Terrace } from '../types';

export const INITIAL_TERRACES: Terrace[] = [
  {
    id: 'terrace_1',
    name: '南山一号 · 沃土台',
    unlocked: true,
    unlockCost: 0,
    altitude: 'lowland',
    soil: 'loam',
    humidity: 'humid',
    temperature: 'warm',
    light: 'full',
    waterSource: 'rain',
    fertilizer: 'none',
    status: 'empty'
  },
  {
    id: 'terrace_2',
    name: '西岭二号 · 苍沙坪',
    unlocked: false,
    unlockCost: 500,
    altitude: 'hills',
    soil: 'sand',
    humidity: 'moderate',
    temperature: 'mild',
    light: 'full',
    waterSource: 'stream',
    fertilizer: 'none',
    status: 'empty'
  },
  {
    id: 'terrace_3',
    name: '险峰三号 · 卧岩台',
    unlocked: false,
    unlockCost: 1500,
    altitude: 'mountain',
    soil: 'rock',
    humidity: 'dry',
    temperature: 'cold',
    light: 'strong',
    waterSource: 'spring',
    fertilizer: 'none',
    status: 'empty'
  },
  {
    id: 'terrace_4',
    name: '绝巅四号 · 雪线坪',
    unlocked: false,
    unlockCost: 4000,
    altitude: 'snowline',
    soil: 'rock',
    humidity: 'dry',
    temperature: 'cold',
    light: 'strong',
    waterSource: 'snow',
    fertilizer: 'none',
    status: 'empty'
  }
];
