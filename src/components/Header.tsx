import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SOLAR_TERMS } from '../config/solarTermsData';
import { soundManager } from '../utils/audio';
import { Coins, Flame, Award, Shield, Volume2, VolumeX, FastForward, Calendar } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    coins,
    ingots,
    skillPoints,
    societyCoins,
    day,
    solarTermIndex,
    solarProgress,
    advanceSolarTerm
  } = useGame();

  const [soundOn, setSoundOn] = useState(true);

  const toggleSound = () => {
    soundManager.enabled = !soundOn;
    setSoundOn(!soundOn);
  };

  const term = SOLAR_TERMS[solarTermIndex] || SOLAR_TERMS[0];

  const seasonColor =
    term.season === 'spring' ? 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50' :
    term.season === 'summer' ? 'text-amber-400 bg-amber-950/60 border-amber-700/50' :
    term.season === 'autumn' ? 'text-orange-400 bg-orange-950/60 border-orange-700/50' :
    'text-cyan-300 bg-cyan-950/60 border-cyan-700/50';

  return (
    <header className="sticky top-0 z-40 bg-[#251a14]/95 backdrop-blur-md border-b border-[#5f412d]/50 px-3 py-2 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col gap-1.5">
        {/* 上栏：头衔、节气、推进与声音 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌰</span>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-[#e7d8bf] flex items-center gap-1.5">
                <span>我是大收藏家</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#432e22] text-[#c6a172] font-normal border border-[#7c5435]/40">
                  第 {day} 日
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 节气徽章 */}
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${seasonColor}`}>
              <Calendar className="w-3 h-3" />
              <span>{term.name}</span>
              <span className="text-[10px] opacity-75">({term.seasonName})</span>
            </div>

            {/* 推进节气按钮 */}
            <button
              onClick={advanceSolarTerm}
              title="消耗岁月，立即流转至下一节气"
              className="flex items-center gap-1 px-2 py-1 rounded bg-[#3b271d] hover:bg-[#523728] text-[#c6a172] text-[11px] border border-[#7c5435]/50 active:scale-95 transition-all"
            >
              <FastForward className="w-3 h-3 text-amber-400" />
              <span>换季</span>
            </button>

            {/* 音效开关 */}
            <button
              onClick={toggleSound}
              className="p-1 rounded bg-[#3b271d] hover:bg-[#523728] text-[#c6a172] border border-[#7c5435]/50"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
            </button>
          </div>
        </div>

        {/* 节气进度细条 */}
        <div className="w-full bg-[#1b120c] h-1 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-600 to-amber-300 h-full transition-all duration-300"
            style={{ width: `${Math.min(100, solarProgress)}%` }}
          />
        </div>

        {/* 下栏：财富与资源 */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 text-xs pt-0.5">
          {/* 铜钱 */}
          <div className="flex items-center gap-1 bg-[#1a120d]/80 px-2 py-1 rounded border border-[#432e22]">
            <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-[#a58667] block sm:inline mr-1">铜钱</span>
              <span className="font-semibold text-[#f4ede1]">{coins.toLocaleString()}</span>
            </div>
          </div>

          {/* 元宝 */}
          <div className="flex items-center gap-1 bg-[#1a120d]/80 px-2 py-1 rounded border border-[#432e22]">
            <Flame className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-[#a58667] block sm:inline mr-1">元宝</span>
              <span className="font-semibold text-red-200">{ingots}</span>
            </div>
          </div>

          {/* 技艺点 */}
          <div className="flex items-center gap-1 bg-[#1a120d]/80 px-2 py-1 rounded border border-[#432e22]">
            <Award className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-[#a58667] block sm:inline mr-1">技艺</span>
              <span className="font-semibold text-blue-200">{skillPoints}</span>
            </div>
          </div>

          {/* 协会币 */}
          <div className="flex items-center gap-1 bg-[#1a120d]/80 px-2 py-1 rounded border border-[#432e22]">
            <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-[#a58667] block sm:inline mr-1">会币</span>
              <span className="font-semibold text-purple-200">{societyCoins}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
