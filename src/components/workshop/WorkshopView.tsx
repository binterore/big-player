import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { WalnutItem } from '../../types';
import { CrackingTool } from '../../services/walnutGenerator';
import { Hammer, Sparkles, AlertCircle, ShieldCheck, ChevronRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WorkshopView: React.FC = () => {
  const { walnuts, crackWalnutById } = useGame();

  const uncrackedWalnuts = walnuts.filter(w => w.isUncracked);
  const [selectedWalnutId, setSelectedWalnutId] = useState<string | null>(
    uncrackedWalnuts[0]?.id || null
  );

  const [selectedTool, setSelectedTool] = useState<CrackingTool>('hammer');
  const [isStriking, setIsStriking] = useState(false);
  const [revealedWalnut, setRevealedWalnut] = useState<WalnutItem | null>(null);

  const activeWalnut = uncrackedWalnuts.find(w => w.id === selectedWalnutId) || uncrackedWalnuts[0];

  const handleCrack = () => {
    if (!activeWalnut || isStriking) return;

    setIsStriking(true);

    // 触发连环敲击裂壳效果
    setTimeout(() => {
      const cracked = crackWalnutById(activeWalnut.id, selectedTool);
      setIsStriking(false);

      if (cracked) {
        setRevealedWalnut(cracked);
        if (cracked.grade === 'five_ridges' || cracked.grade === 'six_ridges' || cracked.grade === 'abnormal') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    }, 450);
  };

  const handleBatchCrack = () => {
    if (uncrackedWalnuts.length === 0) return;
    uncrackedWalnuts.forEach(w => {
      crackWalnutById(w.id, selectedTool);
    });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 顶部标题与批量速开 */}
      <div className="flex items-center justify-between bg-[#251a14] p-3 rounded-2xl border border-[#5f412d] shadow-lg">
        <div>
          <h2 className="text-sm font-bold text-[#f4ede1] flex items-center gap-1.5">
            <Hammer className="w-4 h-4 text-amber-500" />
            <span>解石开核房 · 赌核见珍</span>
          </h2>
          <p className="text-[11px] text-[#a58667] mt-0.5">
            待开青皮：<span className="text-amber-400 font-bold">{uncrackedWalnuts.length}</span> 颗
          </p>
        </div>

        {uncrackedWalnuts.length > 1 && (
          <button
            onClick={handleBatchCrack}
            className="px-3 py-1.5 rounded-lg bg-[#3b271d] hover:bg-[#523728] text-amber-300 text-xs font-semibold border border-amber-600/40 active:scale-95 transition-all shadow"
          >
            一键全开
          </button>
        )}
      </div>

      {uncrackedWalnuts.length === 0 ? (
        <div className="bg-[#251a14] rounded-2xl p-10 border border-[#5f412d] text-center space-y-3">
          <div className="text-4xl">🧺</div>
          <h3 className="text-sm font-bold text-[#f4ede1]">行囊中暂无未开青皮</h3>
          <p className="text-xs text-[#a58667]">请前往【台地】种植采摘，或至【市集】向客商收购生核！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 青皮选择横排 */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {uncrackedWalnuts.map(w => {
              const isSelected = w.id === activeWalnut?.id;
              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedWalnutId(w.id)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#432e22] border-[#c6a172] text-[#f4ede1] shadow-md scale-102'
                      : 'bg-[#251a14]/80 border-[#5f412d]/40 text-[#a58667] hover:border-[#7c5435]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#f4ede1]">{w.varietyName}</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">
                    约 {w.rawSizeMm}mm · {w.rawWeightG}g
                  </div>
                </button>
              );
            })}
          </div>

          {/* 开核操作主台 */}
          <div className="bg-[#251a14] rounded-2xl p-5 border border-[#5f412d] space-y-5 shadow-xl text-center relative overflow-hidden">
            {/* 青皮预判提示 */}
            <div className="bg-[#1a120d] p-2.5 rounded-xl border border-[#432e22] text-xs text-[#c6a172] flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{activeWalnut?.estimatePreview}</span>
            </div>

            {/* 开核木案与核桃视觉模拟 */}
            <div className="relative py-6 flex flex-col items-center justify-center">
              <div
                onClick={handleCrack}
                className={`w-32 h-32 rounded-full cursor-pointer flex items-center justify-center text-6xl shadow-2xl transition-all duration-200 border-4 ${
                  isStriking
                    ? 'scale-90 border-red-500 bg-red-950/40 rotate-6'
                    : 'hover:scale-105 border-[#8b5a36] bg-gradient-to-b from-[#4a3224] to-[#261710]'
                }`}
              >
                <span>🌰</span>

                {/* 裂纹视觉效果 */}
                {isStriking && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-4xl text-amber-300 font-extrabold animate-ping">💥</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-[#a58667] mt-3">
                点击上方青皮或下方按钮，破壳露真容！
              </div>
            </div>

            {/* 工具手法选择 */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#e7d8bf] text-left">选择开核工具与手法：</div>
              <div className="grid grid-cols-3 gap-2">
                {/* 锤 */}
                <button
                  onClick={() => setSelectedTool('hammer')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedTool === 'hammer'
                      ? 'bg-[#432e22] border-[#c6a172] text-[#f4ede1] shadow-md'
                      : 'bg-[#1f1612] border-[#432e22] text-[#a58667]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#f4ede1]">小铜锤 · 稳健敲击</div>
                  <div className="text-[10px] text-stone-400 mt-1">保形度 ~94%</div>
                </button>

                {/* 夹 */}
                <button
                  onClick={() => setSelectedTool('clamp')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedTool === 'clamp'
                      ? 'bg-[#432e22] border-[#c6a172] text-[#f4ede1] shadow-md'
                      : 'bg-[#1f1612] border-[#432e22] text-[#a58667]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#f4ede1]">文玩夹 · 均匀夹压</div>
                  <div className="text-[10px] text-stone-400 mt-1">保形度 ~86%</div>
                </button>

                {/* 撬 */}
                <button
                  onClick={() => setSelectedTool('pick')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedTool === 'pick'
                      ? 'bg-[#432e22] border-[#c6a172] text-[#f4ede1] shadow-md'
                      : 'bg-[#1f1612] border-[#432e22] text-[#a58667]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#f4ede1]">银挑针 · 细致轻撬</div>
                  <div className="text-[10px] text-stone-400 mt-1">保形度 ~96%</div>
                </button>
              </div>
            </div>

            {/* 破壳出彩主按钮 */}
            <button
              disabled={isStriking}
              onClick={handleCrack}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold text-sm shadow-xl shadow-amber-900/50 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Hammer className="w-4 h-4" />
              <span>{isStriking ? '正在碎壳揭晓...' : '立 即 砸 开 核 桃'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 开核结果揭晓弹窗 */}
      {revealedWalnut && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#251a14] rounded-2xl max-w-sm w-full border-2 border-amber-500 p-5 space-y-4 shadow-2xl text-center">
            <div className="text-xs font-bold text-amber-400 tracking-widest uppercase">
              ✦ 造化天成 · 宝核现世 ✦
            </div>

            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-900 to-stone-900 mx-auto flex items-center justify-center text-4xl border-2 border-amber-400 shadow-lg">
              🌰
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-[#f4ede1]">{revealedWalnut.name}</h3>
              <div className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-600">
                {revealedWalnut.gradeName}
              </div>
            </div>

            {/* 五维物理属性表 */}
            <div className="bg-[#1a120d] rounded-xl p-3 border border-[#432e22] text-xs grid grid-cols-2 gap-2 text-left">
              <div>
                <span className="text-[#a58667]">边宽肚径：</span>
                <span className="text-[#f4ede1] font-semibold">{revealedWalnut.edgeWidth} × {revealedWalnut.bellyWidth} mm</span>
              </div>
              <div>
                <span className="text-[#a58667]">分量高度：</span>
                <span className="text-[#f4ede1] font-semibold">{revealedWalnut.weight}g · {revealedWalnut.height}mm</span>
              </div>
              <div>
                <span className="text-[#a58667]">桩型身段：</span>
                <span className="text-[#f4ede1] font-semibold">{revealedWalnut.postureName?.split('·')[0]}</span>
              </div>
              <div>
                <span className="text-[#a58667]">皮质色泽：</span>
                <span className="text-[#f4ede1] font-semibold">{revealedWalnut.skinColorName?.split('·')[0]}</span>
              </div>
              <div>
                <span className="text-[#a58667]">纹路脉络：</span>
                <span className="text-amber-300 font-semibold">{revealedWalnut.patternName?.split('·')[0]}</span>
              </div>
              <div>
                <span className="text-[#a58667]">完整保形：</span>
                <span className="text-emerald-400 font-semibold">{revealedWalnut.integrity}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-[#a58667]">市场行家估值：</span>
              <span className="text-amber-400 font-bold text-sm">{revealedWalnut.estimatedValue} 铜钱</span>
            </div>

            <button
              onClick={() => setRevealedWalnut(null)}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg active:scale-95 transition-all"
            >
              收入锦囊行囊
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
