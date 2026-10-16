import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { CollectorId, CollectorExchange, CollectorLetter } from '../../types';
import { ANTIQUES_MAP } from '../../config/antiquesData';
import { Mail, Sparkles, Heart, ChevronRight, CheckCircle2, MessageSquare, Gift, X } from 'lucide-react';

export const CollectorsView: React.FC = () => {
  const {
    collectors,
    exchanges,
    letters,
    walnuts,
    submitExchange,
    replyLetter,
    claimLetterReward
  } = useGame();

  const [tab, setTab] = useState<'exchanges' | 'letters'>('exchanges');
  const [selectedCollectorId, setSelectedCollectorId] = useState<CollectorId>('old_friend');
  const [activeExchange, setActiveExchange] = useState<CollectorExchange | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<CollectorLetter | null>(null);

  // 选中的核桃用于提交
  const [selectedWalnutIds, setSelectedWalnutIds] = useState<string[]>([]);

  const activeCollector = collectors.find(c => c.id === selectedCollectorId) || collectors[0];
  const collectorExchanges = exchanges.filter(e => e.collectorId === selectedCollectorId);

  const unreadLettersCount = letters.filter(l => !l.rewardClaimed || l.repliedIndex === undefined).length;

  return (
    <div className="space-y-4 pb-20">
      {/* 顶部二级导航 */}
      <div className="flex bg-[#251a14] p-1 rounded-xl border border-[#5f412d] shadow">
        <button
          onClick={() => setTab('exchanges')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            tab === 'exchanges'
              ? 'bg-[#432e22] text-amber-300 shadow border border-[#c6a172]/40'
              : 'text-[#9b7b62] hover:text-[#d7be99]'
          }`}
        >
          <span>名士雅集 · 以核易宝</span>
        </button>

        <button
          onClick={() => setTab('letters')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 relative ${
            tab === 'letters'
              ? 'bg-[#432e22] text-amber-300 shadow border border-[#c6a172]/40'
              : 'text-[#9b7b62] hover:text-[#d7be99]'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>飞鸽传书 · 尺素心曲</span>
          {unreadLettersCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          )}
        </button>
      </div>

      {tab === 'exchanges' ? (
        /* 子界面 1：以核易宝 */
        <div className="space-y-4">
          {/* 五大收藏家横排切换 */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {collectors.map(c => {
              const isSelected = c.id === selectedCollectorId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCollectorId(c.id)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#432e22] border-amber-500 text-white shadow-md'
                      : 'bg-[#251a14] border-[#432e22] text-[#a58667] hover:border-[#7c5435]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.avatar}</span>
                    <div>
                      <div className="text-xs font-bold">{c.name}</div>
                      <div className="text-[10px] text-amber-400">好感 {c.favor}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 收藏家人物画像卡片 */}
          <div className="bg-[#251a14] rounded-2xl p-4 border border-[#5f412d] space-y-3 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#3b271d] flex items-center justify-center text-3xl border border-[#7c5435] shrink-0">
                {activeCollector.avatar}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#f4ede1]">{activeCollector.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#3b271d] text-[#c6a172] border border-[#7c5435]/40">
                    {activeCollector.title}
                  </span>
                </div>
                <p className="text-xs text-[#a58667]">{activeCollector.obsession}</p>
                <div className="text-[11px] text-amber-400/90 font-medium pt-1">
                  🎯 投其所好：{activeCollector.preferenceDesc}
                </div>
              </div>
            </div>

            {/* 该收藏家提供的兑换委托列表 */}
            <div className="space-y-2 pt-2 border-t border-[#432e22]">
              <div className="text-xs font-bold text-[#e7d8bf]">国宝兑换契约：</div>
              {collectorExchanges.map(ex => {
                const targetAntique = ANTIQUES_MAP.get(ex.targetAntiqueId);
                return (
                  <div
                    key={ex.id}
                    className="p-3 rounded-xl bg-[#1a120d] border border-[#432e22] space-y-2 hover:border-[#7c5435] transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#f4ede1] flex items-center gap-1.5">
                          <span>{ex.title}</span>
                          {ex.isCompleted && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">
                              已迎回
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#a58667] mt-0.5 leading-relaxed">
                          所需：{ex.reqDesc}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-amber-400">
                          {targetAntique?.name}
                        </span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          {targetAntique?.era}
                        </span>
                      </div>
                    </div>

                    {!ex.isCompleted ? (
                      <button
                        onClick={() => {
                          setActiveExchange(ex);
                          setSelectedWalnutIds([]);
                        }}
                        className="w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow active:scale-95 transition-all mt-1"
                      >
                        选择核桃兑换国宝
                      </button>
                    ) : (
                      <div className="text-center py-1 text-[11px] text-emerald-400/80 font-medium">
                        ✓ 宝物已恭请入私人展馆
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* 子界面 2：飞鸽传书 */
        <div className="space-y-3">
          {letters.map(letter => {
            const hasClaimed = letter.rewardClaimed;
            const hasReplied = letter.repliedIndex !== undefined;

            return (
              <div
                key={letter.id}
                onClick={() => setSelectedLetter(letter)}
                className="p-3.5 rounded-xl bg-[#251a14] border border-[#5f412d] hover:border-amber-500 cursor-pointer transition-all space-y-2 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">✉️</span>
                    <span className="text-xs font-bold text-[#f4ede1]">{letter.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-stone-400">{letter.collectorName}</span>
                    {(!hasClaimed || !hasReplied) && (
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#a58667] line-clamp-2 leading-relaxed">
                  {letter.content}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* 兑换提交选择弹窗 */}
      {activeExchange && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#251a14] rounded-2xl max-w-md w-full border border-[#7c5435] p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#432e22] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#f4ede1]">{activeExchange.title}</h3>
                <p className="text-[11px] text-amber-400 mt-0.5">{activeExchange.reqDesc}</p>
              </div>
              <button onClick={() => setActiveExchange(null)} className="text-stone-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="text-xs font-semibold text-[#e7d8bf]">从行囊中勾选符合要求的核桃：</div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {walnuts.map(w => {
                const isChecked = selectedWalnutIds.includes(w.id);
                return (
                  <div
                    key={w.id}
                    onClick={() => {
                      if (isChecked) {
                        setSelectedWalnutIds(selectedWalnutIds.filter(id => id !== w.id));
                      } else {
                        setSelectedWalnutIds([...selectedWalnutIds, w.id]);
                      }
                    }}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isChecked
                        ? 'bg-[#432e22] border-amber-500 text-white'
                        : 'bg-[#1a120d] border-[#432e22] text-[#a58667]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-[#f4ede1]">{w.name}</div>
                      <div className="text-[10px] text-amber-400 mt-0.5">
                        {w.isUncracked ? '未开青皮' : `${w.edgeWidth}mm · ${w.ridges}棱 · ${w.postureName?.split('·')[0]}`}
                      </div>
                    </div>
                    {isChecked && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                );
              })}
            </div>

            <button
              disabled={selectedWalnutIds.length === 0}
              onClick={() => {
                const ok = submitExchange(activeExchange.id, selectedWalnutIds);
                if (ok) setActiveExchange(null);
              }}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedWalnutIds.length > 0
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg active:scale-95'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              确 认 交 割 兑 换
            </button>
          </div>
        </div>
      )}

      {/* 尺素信件阅读弹窗 */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#251a14] rounded-2xl max-w-sm w-full border-2 border-amber-600/70 p-5 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedLetter(null)}
              className="absolute right-4 top-4 text-stone-400 hover:text-white"
            >
              ✕
            </button>

            <div className="text-center border-b border-[#432e22] pb-3">
              <span className="text-[10px] text-amber-400 font-semibold tracking-wider">
                【{selectedLetter.collectorName} 亲笔信函】
              </span>
              <h3 className="text-sm font-bold text-[#f4ede1] mt-1">{selectedLetter.title}</h3>
            </div>

            {/* 信件笺纸正文 */}
            <div className="bg-[#1f1612] p-4 rounded-xl border border-[#432e22] text-xs text-[#d7be99] leading-relaxed font-serif whitespace-pre-wrap">
              {selectedLetter.content}
            </div>

            {/* 随信厚礼 */}
            {selectedLetter.rewardDesc && (
              <div className="bg-[#18100b] p-3 rounded-lg border border-[#3b271d] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#a58667] text-[10px] block">随函寄付：</span>
                  <span className="text-amber-300 font-semibold">{selectedLetter.rewardDesc}</span>
                </div>
                {!selectedLetter.rewardClaimed ? (
                  <button
                    onClick={() => claimLetterReward(selectedLetter.id)}
                    className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold shadow"
                  >
                    收入囊中
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-semibold">✓ 已入账</span>
                )}
              </div>
            )}

            {/* 回信选项 */}
            {selectedLetter.replyOptions && selectedLetter.repliedIndex === undefined && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] text-[#c6a172] font-semibold">挥毫作复：</span>
                {selectedLetter.replyOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => replyLetter(selectedLetter.id, i)}
                    className="w-full p-2 rounded-lg bg-[#3b271d] hover:bg-[#523728] text-left text-xs text-[#f4ede1] border border-[#5f412d] transition-all"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            )}

            {selectedLetter.repliedIndex !== undefined && selectedLetter.replyOptions && (
              <div className="text-[11px] text-amber-400/90 bg-[#1a120d] p-2.5 rounded border border-[#432e22]">
                已回复：{selectedLetter.replyOptions[selectedLetter.repliedIndex].response}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
