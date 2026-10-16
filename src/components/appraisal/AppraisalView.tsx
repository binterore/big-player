import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { WalnutItem } from '../../types';
import { calculatePairing } from '../../services/pairingEngine';
import { Eye, Box, Sparkles, Award, ShieldCheck, Check, ArrowRight } from 'lucide-react';

export const AppraisalView: React.FC = () => {
  const {
    walnuts,
    coins,
    appraiseWalnutById,
    pairWalnutsById,
    playWithWalnut
  } = useGame();

  const [subTab, setSubTab] = useState<'appraisal' | 'pairing'>('appraisal');

  // 筛选出已开核的核桃
  const crackedWalnuts = walnuts.filter(w => !w.isUncracked && !w.isPairedBox);

  // 鉴定所选中的核桃
  const [selectedAppraisalId, setSelectedAppraisalId] = useState<string | null>(
    crackedWalnuts[0]?.id || null
  );

  // 配对阁选中的两只核桃
  const [pairId1, setPairId1] = useState<string | null>(null);
  const [pairId2, setPairId2] = useState<string | null>(null);

  const activeAppraisalWalnut = crackedWalnuts.find(w => w.id === selectedAppraisalId) || crackedWalnuts[0];

  const w1 = crackedWalnuts.find(w => w.id === pairId1);
  const w2 = crackedWalnuts.find(w => w.id === pairId2);
  const pairResult = w1 && w2 ? calculatePairing(w1, w2) : null;

  return (
    <div className="space-y-4 pb-20">
      {/* 顶部二级导航 */}
      <div className="flex bg-[#251a14] p-1 rounded-xl border border-[#5f412d] shadow">
        <button
          onClick={() => setSubTab('appraisal')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'appraisal'
              ? 'bg-[#432e22] text-amber-300 shadow border border-[#c6a172]/40'
              : 'text-[#9b7b62] hover:text-[#d7be99]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>品相鉴定所</span>
        </button>

        <button
          onClick={() => setSubTab('pairing')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'pairing'
              ? 'bg-[#432e22] text-amber-300 shadow border border-[#c6a172]/40'
              : 'text-[#9b7b62] hover:text-[#d7be99]'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>文玩配对阁</span>
        </button>
      </div>

      {crackedWalnuts.length === 0 ? (
        <div className="bg-[#251a14] rounded-2xl p-10 border border-[#5f412d] text-center space-y-3">
          <div className="text-4xl">📭</div>
          <h3 className="text-sm font-bold text-[#f4ede1]">暂无已开核之文玩</h3>
          <p className="text-xs text-[#a58667]">请前往【开核】工坊解开青皮，方可在此品鉴与配对成双！</p>
        </div>
      ) : subTab === 'appraisal' ? (
        /* 子界面 1：品相鉴定所 */
        <div className="space-y-4">
          {/* 核桃选择横排 */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {crackedWalnuts.map(w => {
              const isSelected = w.id === activeAppraisalWalnut?.id;
              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedAppraisalId(w.id)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#432e22] border-[#c6a172] text-[#f4ede1] shadow-md scale-102'
                      : 'bg-[#251a14]/80 border-[#5f412d]/40 text-[#a58667] hover:border-[#7c5435]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#f4ede1] flex items-center gap-1">
                    <span>{w.name}</span>
                    {w.hasCertificate && <span className="text-[10px] text-amber-400">📜</span>}
                  </div>
                  <div className="text-[10px] text-amber-400 mt-0.5">
                    {w.edgeWidth}mm · 包浆{w.patinaLevel}%
                  </div>
                </button>
              );
            })}
          </div>

          {activeAppraisalWalnut && (
            <div className="bg-[#251a14] rounded-2xl p-5 border border-[#5f412d] space-y-4 shadow-xl">
              {/* 鉴定证书展台 */}
              <div className={`p-4 rounded-xl border relative overflow-hidden ${
                activeAppraisalWalnut.hasCertificate
                  ? 'bg-gradient-to-b from-[#3d2a1d] to-[#251a14] border-amber-500/80 shadow-2xl'
                  : 'bg-[#1a120d] border-[#432e22]'
              }`}>
                {/* 证书红印章 */}
                {activeAppraisalWalnut.hasCertificate && (
                  <div className="absolute right-3 top-3 w-14 h-14 rounded-full border-2 border-red-600/80 bg-red-950/40 text-red-500 font-extrabold flex items-center justify-center text-xs rotate-12 shadow">
                    {activeAppraisalWalnut.appraisalLevel === 'divine' ? '神品至尊' :
                     activeAppraisalWalnut.appraisalLevel === 'precious' ? '御赐珍品' :
                     activeAppraisalWalnut.appraisalLevel === 'superior' ? '上上之选' : '良品证书'}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[#3b271d] flex items-center justify-center text-3xl border border-[#7c5435] shrink-0">
                    🌰
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#f4ede1]">{activeAppraisalWalnut.name}</h3>
                    <div className="text-xs text-amber-300 mt-0.5">
                      {activeAppraisalWalnut.gradeName} · {activeAppraisalWalnut.edgeWidth}mm
                    </div>
                  </div>
                </div>

                {/* 属性细则 */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-3 mt-3 border-t border-[#432e22]/60">
                  <div>
                    <span className="text-[#a58667]">身段桩型：</span>
                    <span className="text-[#f4ede1]">{activeAppraisalWalnut.postureName}</span>
                  </div>
                  <div>
                    <span className="text-[#a58667]">表面纹路：</span>
                    <span className="text-[#f4ede1]">{activeAppraisalWalnut.patternName}</span>
                  </div>
                  <div>
                    <span className="text-[#a58667]">皮质油润：</span>
                    <span className="text-[#f4ede1]">{activeAppraisalWalnut.skinColorName} (油性{activeAppraisalWalnut.oiliness})</span>
                  </div>
                  <div>
                    <span className="text-[#a58667]">包浆火候：</span>
                    <span className="text-amber-400 font-bold">{activeAppraisalWalnut.patinaLevel}% (已盘{activeAppraisalWalnut.playCount || 0}次)</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#432e22]/60 flex items-center justify-between text-xs">
                  <span className="text-[#a58667]">品相评估总分：</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {activeAppraisalWalnut.appraisalScore} 分
                  </span>
                </div>
              </div>

              {/* 交互按钮栏 */}
              <div className="grid grid-cols-2 gap-2">
                {/* 盘玩包浆 */}
                <button
                  onClick={() => playWithWalnut(activeAppraisalWalnut.id)}
                  className="py-2.5 rounded-xl bg-[#3b271d] hover:bg-[#523728] text-amber-300 text-xs font-bold border border-amber-600/40 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>摩挲盘玩 · 促生包浆</span>
                </button>

                {/* 开具证书 */}
                {!activeAppraisalWalnut.hasCertificate ? (
                  <button
                    onClick={() => appraiseWalnutById(activeAppraisalWalnut.id)}
                    className="py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>请名家鉴定(50钱)</span>
                  </button>
                ) : (
                  <div className="py-2.5 rounded-xl bg-emerald-950/50 text-emerald-300 text-xs font-semibold border border-emerald-800 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>已获正式鉴定证书</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 子界面 2：文玩配对阁 (成双成对) */
        <div className="space-y-4">
          <div className="bg-[#251a14] rounded-2xl p-4 border border-[#5f412d] space-y-4 shadow-xl">
            <div className="text-xs text-[#a58667] leading-relaxed">
              文玩核桃以“成对”为至尊境界。尺寸差、桩型、纹理、皮色与棱数五维高度一致者，方为绝品！
            </div>

            {/* 双核放置锦盒槽位 */}
            <div className="grid grid-cols-2 gap-3">
              {/* 槽位 1 */}
              <div className="bg-[#1a120d] p-3 rounded-xl border border-[#432e22] text-center space-y-2">
                <div className="text-[11px] text-[#c6a172] font-semibold">首只配对核</div>
                {w1 ? (
                  <div className="space-y-1">
                    <div className="text-2xl">🌰</div>
                    <div className="text-xs font-bold text-[#f4ede1]">{w1.name}</div>
                    <div className="text-[10px] text-amber-400">{w1.edgeWidth}mm · {w1.ridges}棱</div>
                    <button
                      onClick={() => setPairId1(null)}
                      className="text-[10px] text-red-400 hover:underline"
                    >
                      取下
                    </button>
                  </div>
                ) : (
                  <div className="py-4 text-xs text-stone-500">点击下方列表置入</div>
                )}
              </div>

              {/* 槽位 2 */}
              <div className="bg-[#1a120d] p-3 rounded-xl border border-[#432e22] text-center space-y-2">
                <div className="text-[11px] text-[#c6a172] font-semibold">次只配对核</div>
                {w2 ? (
                  <div className="space-y-1">
                    <div className="text-2xl">🌰</div>
                    <div className="text-xs font-bold text-[#f4ede1]">{w2.name}</div>
                    <div className="text-[10px] text-amber-400">{w2.edgeWidth}mm · {w2.ridges}棱</div>
                    <button
                      onClick={() => setPairId2(null)}
                      className="text-[10px] text-red-400 hover:underline"
                    >
                      取下
                    </button>
                  </div>
                ) : (
                  <div className="py-4 text-xs text-stone-500">点击下方列表置入</div>
                )}
              </div>
            </div>

            {/* 实时配对综合评分雷达与判定 */}
            {pairResult && w1 && w2 && (
              <div className="bg-[#1f1612] p-3 rounded-xl border border-[#432e22] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#c6a172] font-bold">综合配对契合度</span>
                  <span className={`text-base font-extrabold ${pairResult.isPerfect ? 'text-amber-400' : pairResult.isSuccess ? 'text-emerald-400' : 'text-stone-400'}`}>
                    {pairResult.score}%
                  </span>
                </div>

                {/* 评语 */}
                <div className="text-xs text-[#f4ede1] bg-[#2a1d17] p-2 rounded border border-[#5f412d] leading-relaxed">
                  {pairResult.commentary}
                </div>

                {/* 五维得分小条 */}
                <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
                  <div className="bg-[#18100b] p-1 rounded">
                    <div className="text-[#a58667]">尺寸</div>
                    <div className="font-bold text-[#f4ede1]">{pairResult.dimensions.size}</div>
                  </div>
                  <div className="bg-[#18100b] p-1 rounded">
                    <div className="text-[#a58667]">桩型</div>
                    <div className="font-bold text-[#f4ede1]">{pairResult.dimensions.posture}</div>
                  </div>
                  <div className="bg-[#18100b] p-1 rounded">
                    <div className="text-[#a58667]">纹路</div>
                    <div className="font-bold text-[#f4ede1]">{pairResult.dimensions.pattern}</div>
                  </div>
                  <div className="bg-[#18100b] p-1 rounded">
                    <div className="text-[#a58667]">皮色</div>
                    <div className="font-bold text-[#f4ede1]">{pairResult.dimensions.skin}</div>
                  </div>
                  <div className="bg-[#18100b] p-1 rounded">
                    <div className="text-[#a58667]">棱数</div>
                    <div className="font-bold text-[#f4ede1]">{pairResult.dimensions.ridges}</div>
                  </div>
                </div>

                {/* 封入锦盒按钮 */}
                {pairResult.isSuccess ? (
                  <button
                    onClick={() => {
                      pairWalnutsById(w1.id, w2.id);
                      setPairId1(null);
                      setPairId2(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold text-xs shadow-lg active:scale-95 transition-all"
                  >
                    封入红木锦盒 · 身价暴涨至 {(w1.estimatedValue + w2.estimatedValue) * pairResult.boxValueMultiplier} 钱
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-stone-500">
                    契合度需达到 85% 方可成功封入锦盒
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 待选文玩列表 */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#e7d8bf]">点击文玩放入配对槽位：</div>
            <div className="grid grid-cols-2 gap-2">
              {crackedWalnuts.map(w => {
                const inSlot1 = w.id === pairId1;
                const inSlot2 = w.id === pairId2;

                return (
                  <button
                    key={w.id}
                    onClick={() => {
                      if (!pairId1) setPairId1(w.id);
                      else if (!pairId2 && w.id !== pairId1) setPairId2(w.id);
                      else if (inSlot1) setPairId1(null);
                      else if (inSlot2) setPairId2(null);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      inSlot1 || inSlot2
                        ? 'bg-[#432e22] border-amber-500 text-white shadow-md'
                        : 'bg-[#1f1612] border-[#432e22] text-[#a58667] hover:border-[#7c5435]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#f4ede1] truncate">{w.name}</div>
                    <div className="text-[10px] text-amber-400 mt-0.5">
                      {w.edgeWidth}mm · {w.ridges}棱 · {w.postureName?.split('·')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
