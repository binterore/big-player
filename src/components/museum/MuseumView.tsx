import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { AntiqueItem } from '../../types';
import { Landmark, Sparkles, Shield, Crown, RefreshCw, X } from 'lucide-react';

export const MuseumView: React.FC = () => {
  const {
    antiques,
    walnuts,
    coins,
    assignAntiqueToHall,
    removeAntiqueFromHall,
    maintainAntiqueById
  } = useGame();

  const [activeHall, setActiveHall] = useState<'walnut_hall' | 'painting_hall' | 'curio_hall'>('walnut_hall');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [inspectedAntique, setInspectedAntique] = useState<AntiqueItem | null>(null);

  const hallNames = {
    walnut_hall: '文玩核桃厅',
    painting_hall: '翰墨书画厅',
    curio_hall: '金石瓷器厅'
  };

  // 获得已解锁但未在当前展馆展出的藏品
  const unlockedAntiques = antiques.filter(a => a.unlocked);

  const getSlotItem = (slotIdx: number) => {
    return antiques.find(
      a => a.displayLocation?.hallId === activeHall && a.displayLocation?.slotIndex === slotIdx
    );
  };

  // 统计展馆声望
  const displayedCount = antiques.filter(a => a.displayLocation).length;
  const totalMuseumValue = antiques
    .filter(a => a.displayLocation)
    .reduce((sum, item) => sum + item.baseValue, 0);

  return (
    <div className="space-y-4 pb-20">
      {/* 展馆声望与总览 */}
      <div className="bg-[#251a14] p-4 rounded-2xl border border-[#5f412d] shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#3b271d] flex items-center justify-center border border-[#7c5435] text-2xl">
            🏛️
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#f4ede1]">江南第一私人典藏馆</h2>
            <div className="text-[11px] text-[#a58667] mt-0.5">
              陈列国宝：<span className="text-amber-400 font-bold">{displayedCount}</span> 件 · 馆藏估值：<span className="text-amber-400 font-bold">{totalMuseumValue.toLocaleString()}</span> 钱
            </div>
          </div>
        </div>
      </div>

      {/* 展厅切换 */}
      <div className="flex bg-[#251a14] p-1 rounded-xl border border-[#5f412d]">
        {(['walnut_hall', 'painting_hall', 'curio_hall'] as const).map(hallId => (
          <button
            key={hallId}
            onClick={() => setActiveHall(hallId)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeHall === hallId
                ? 'bg-[#432e22] text-amber-300 shadow border border-[#c6a172]/40'
                : 'text-[#9b7b62] hover:text-[#d7be99]'
            }`}
          >
            {hallNames[hallId]}
          </button>
        ))}
      </div>

      {/* 展馆陈列格子 (首版 6 个格子，格子 0 为镇馆之位) */}
      <div className="bg-[#251a14] rounded-2xl p-4 border border-[#5f412d] space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#e7d8bf]">{hallNames[activeHall]} · 展位陈列</span>
          <span className="text-[10px] text-[#a58667]">点击空位布展，点击展品鉴赏保养</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[0, 1, 2, 3, 4, 5].map(idx => {
            const isTreasureSlot = idx === 0;
            const item = getSlotItem(idx);

            return (
              <div
                key={idx}
                onClick={() => {
                  if (item) setInspectedAntique(item);
                  else setSelectedSlotIndex(idx);
                }}
                className={`relative min-h-[120px] rounded-xl p-3 border cursor-pointer transition-all flex flex-col justify-between ${
                  isTreasureSlot
                    ? 'border-amber-500/80 bg-gradient-to-b from-[#3d291b] to-[#1f1612] shadow-lg shadow-amber-950/50'
                    : 'border-[#432e22] bg-[#1a120d] hover:border-[#7c5435]'
                }`}
              >
                {/* 镇馆之位徽记 */}
                {isTreasureSlot && (
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 text-[9px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-600/50">
                    <Crown className="w-2.5 h-2.5" />
                    <span>镇馆之位</span>
                  </div>
                )}

                {item ? (
                  <div className="space-y-1.5">
                    <div className="text-2xl mt-1">
                      {item.category === 'sword' ? '🗡️' : item.category === 'painting' ? '📜' : item.category === 'porcelain' ? '🏺' : '💎'}
                    </div>
                    <div className="text-xs font-bold text-[#f4ede1] line-clamp-1">{item.name}</div>
                    <div className="text-[10px] text-amber-400 font-semibold">{item.era}</div>
                    <div className="flex items-center gap-1 text-[9px] text-stone-400 pt-1">
                      <span className={`px-1 rounded ${item.condition === 'masterpiece' ? 'bg-emerald-950 text-emerald-300' : 'bg-stone-800 text-stone-400'}`}>
                        {item.condition === 'masterpiece' ? '精品' : item.condition === 'intact' ? '完好' : '陈旧'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-6 text-stone-500 hover:text-stone-300">
                    <div className="text-xl mb-1">+</div>
                    <div className="text-[11px]">空置展台</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 展品鉴赏与保养弹窗 */}
      {inspectedAntique && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#251a14] rounded-2xl max-w-sm w-full border-2 border-[#7c5435] p-5 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#432e22] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#f4ede1]">{inspectedAntique.name}</h3>
                <span className="text-xs text-amber-400 font-semibold mt-0.5 block">{inspectedAntique.era} · {inspectedAntique.categoryName}</span>
              </div>
              <button
                onClick={() => setInspectedAntique(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#a58667] leading-relaxed bg-[#1a120d] p-3 rounded-xl border border-[#432e22]">
              {inspectedAntique.description}
            </p>

            <div className="text-[11px] text-[#c6a172] bg-[#342217] p-2.5 rounded-lg border border-[#5f412d] leading-relaxed">
              📜 <span className="font-semibold">流传故事：</span>{inspectedAntique.story}
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-[#a58667]">当前品相状态：</span>
              <span className="text-emerald-400 font-bold">
                {inspectedAntique.condition === 'masterpiece' ? '精品至美' : inspectedAntique.condition === 'intact' ? '完好无损' : '岁月陈旧'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => maintainAntiqueById(inspectedAntique.id)}
                className="py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 text-white text-xs font-bold shadow active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>养护打蜡(150钱)</span>
              </button>

              <button
                onClick={() => {
                  removeAntiqueFromHall(inspectedAntique.id);
                  setInspectedAntique(null);
                }}
                className="py-2.5 rounded-xl bg-[#3b271d] hover:bg-[#523728] text-stone-300 text-xs font-semibold border border-[#7c5435] active:scale-95 transition-all"
              >
                撤下展台
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 选择藏品布展弹窗 */}
      {selectedSlotIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#251a14] rounded-2xl max-w-md w-full border border-[#7c5435] p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#432e22] pb-3">
              <h3 className="text-sm font-bold text-[#f4ede1]">
                选择藏品陈列至第 {selectedSlotIndex + 1} 展位
              </h3>
              <button
                onClick={() => setSelectedSlotIndex(null)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {unlockedAntiques.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-500">
                尚未从收藏家处迎回任何国宝！请前往【藏家】界面完成委托。
              </div>
            ) : (
              <div className="space-y-2">
                {unlockedAntiques.map(antique => (
                  <div
                    key={antique.id}
                    onClick={() => {
                      assignAntiqueToHall(antique.id, activeHall, selectedSlotIndex, selectedSlotIndex === 0);
                      setSelectedSlotIndex(null);
                    }}
                    className="p-3 rounded-xl bg-[#1a120d] border border-[#432e22] hover:border-amber-500 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#f4ede1]">{antique.name}</div>
                      <div className="text-[10px] text-amber-400 mt-0.5">{antique.era} · {antique.categoryName}</div>
                    </div>
                    <span className="text-xs text-amber-400 font-bold">{antique.baseValue} 钱</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
