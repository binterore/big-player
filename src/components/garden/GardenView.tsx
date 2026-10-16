import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { VARIETIES, VARIETIES_MAP } from '../../config/varietiesData';
import { SOLAR_TERMS } from '../../config/solarTermsData';
import { evaluateTerraceClimate } from '../../services/climateEngine';
import { GRADE_NAMES } from '../../services/walnutGenerator';
import { Terrace, Altitude, Soil, Humidity, Temperature, Light, WaterSource, Fertilizer } from '../../types';
import { Droplet, Sun, Wind, Mountain, Sprout, Sparkles, Lock, ArrowUpCircle } from 'lucide-react';

export const GardenView: React.FC = () => {
  const {
    terraces,
    coins,
    seeds,
    solarTermIndex,
    skills,
    unlockTerrace,
    updateTerraceCondition,
    plantTerrace,
    harvestTerrace,
    speedUpTerrace,
    buySeed
  } = useGame();

  const [selectedTerraceId, setSelectedTerraceId] = useState<string>(terraces[0]?.id || '');
  const [plantingModalTerraceId, setPlantingModalTerraceId] = useState<string | null>(null);

  const activeTerrace = terraces.find(t => t.id === selectedTerraceId) || terraces[0];
  const currentTerm = SOLAR_TERMS[solarTermIndex];
  const breedingLevel = skills.find(s => s.branch === 'breeding')?.level || 0;

  // 计算当前台地与预选品种的匹配度
  const previewVariety = activeTerrace.currentVarietyId
    ? VARIETIES_MAP.get(activeTerrace.currentVarietyId)
    : VARIETIES[0];

  const climateEval = previewVariety
    ? evaluateTerraceClimate(activeTerrace, previewVariety, currentTerm, breedingLevel)
    : null;

  return (
    <div className="space-y-4 pb-20">
      {/* 顶部台地选择轮播 */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {terraces.map(t => {
          const isSelected = t.id === selectedTerraceId;
          const isReady = t.status === 'ready';
          const isGrowing = t.status === 'growing';

          return (
            <button
              key={t.id}
              onClick={() => setSelectedTerraceId(t.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#432e22] border-[#c6a172] text-[#f4ede1] shadow-md'
                  : 'bg-[#251a14]/80 border-[#5f412d]/40 text-[#a58667] hover:border-[#7c5435]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {!t.unlocked ? (
                  <Lock className="w-3.5 h-3.5 text-stone-500" />
                ) : isReady ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ) : isGrowing ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-stone-500" />
                )}
                <span className="text-xs font-bold truncate max-w-[110px]">{t.name}</span>
              </div>
              <div className="text-[10px] opacity-75 mt-0.5">
                {!t.unlocked ? `需 ${t.unlockCost} 铜钱` : isReady ? '可采摘成熟核桃' : isGrowing ? '正在茁壮成长' : '台地闲置'}
              </div>
            </button>
          );
        })}
      </div>

      {/* 当前台地主卡片 */}
      {!activeTerrace.unlocked ? (
        /* 未解锁状态 */
        <div className="bg-[#251a14] rounded-2xl p-6 border border-[#5f412d] text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[#3b271d] mx-auto flex items-center justify-center border border-[#7c5435]">
            <Mountain className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#f4ede1]">{activeTerrace.name}</h2>
            <p className="text-xs text-[#a58667] mt-1">开垦此方灵秀台地，扩展更多稀有品种的种植空间。</p>
          </div>
          <button
            onClick={() => unlockTerrace(activeTerrace.id)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-900/40 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>耗费 {activeTerrace.unlockCost} 铜钱开垦</span>
          </button>
        </div>
      ) : (
        /* 已解锁种植区 */
        <div className="bg-[#251a14] rounded-2xl p-4 border border-[#5f412d] space-y-4 shadow-xl">
          {/* 台地标题与种植状态 */}
          <div className="flex items-center justify-between border-b border-[#432e22] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#f4ede1] flex items-center gap-2">
                <span>{activeTerrace.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#3b271d] text-[#c6a172] border border-[#7c5435]/50">
                  {activeTerrace.altitude === 'lowland' ? '低地' : activeTerrace.altitude === 'hills' ? '丘陵' : activeTerrace.altitude === 'mountain' ? '高山' : '雪线'} · {activeTerrace.soil === 'sand' ? '沙土' : activeTerrace.soil === 'loam' ? '壤土' : activeTerrace.soil === 'clay' ? '黏土' : '岩土'}
                </span>
              </h2>
              <div className="text-[11px] text-[#a58667] mt-0.5">
                当前品种：{activeTerrace.currentVarietyId ? VARIETIES_MAP.get(activeTerrace.currentVarietyId)?.name : '未播种'}
              </div>
            </div>

            {/* 播种/采摘/催熟交互按钮 */}
            <div>
              {activeTerrace.status === 'empty' && (
                <button
                  onClick={() => setPlantingModalTerraceId(activeTerrace.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Sprout className="w-3.5 h-3.5" />
                  <span>选种播种</span>
                </button>
              )}

              {activeTerrace.status === 'growing' && (
                <button
                  onClick={() => speedUpTerrace(activeTerrace.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#3b271d] hover:bg-[#523728] text-amber-300 font-medium text-xs border border-amber-600/40 active:scale-95 transition-all flex items-center gap-1.5 shadow"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>催熟(30钱)</span>
                </button>
              )}

              {activeTerrace.status === 'ready' && (
                <button
                  onClick={() => harvestTerrace(activeTerrace.id)}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-900/50 active:scale-95 transition-all flex items-center gap-1.5 animate-bounce"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>采收青皮核桃</span>
                </button>
              )}
            </div>
          </div>

          {/* 实时匹配度与品质系数计算器 (核心数值呈现) */}
          {climateEval && (
            <div className="bg-[#1a120d] rounded-xl p-3 border border-[#432e22] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#c6a172] font-semibold flex items-center gap-1">
                  <span>台地适生匹配度</span>
                  <span className="text-[10px] text-[#8e6e52]">({previewVariety?.name})</span>
                </span>
                <span className="text-amber-400 font-bold text-sm">
                  {climateEval.matchingScore} <span className="text-[10px] font-normal text-stone-400">/ 100 分</span>
                </span>
              </div>

              {/* 品质系数与保底 */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#2e1d14]">
                <div>
                  <span className="text-[#a58667]">品质系数：</span>
                  <span className="text-[#f4ede1] font-semibold">{climateEval.qualityCoefficient}</span>
                </div>
                <div>
                  <span className="text-[#a58667]">保底成核：</span>
                  <span className="text-emerald-400 font-bold">
                    {GRADE_NAMES[climateEval.guaranteedGrade].split('·')[1].trim()}
                  </span>
                </div>
              </div>

              {/* 冲突矛盾提示 */}
              {previewVariety?.contradictionDesc && (
                <div className="text-[10px] text-amber-500/90 bg-amber-950/30 px-2 py-1 rounded border border-amber-800/30">
                  ⚠️ 特性机理：{previewVariety.contradictionDesc}
                </div>
              )}
            </div>
          )}

          {/* 三层微气候调控面板 */}
          <div className="space-y-3 pt-1">
            <div className="text-xs font-bold text-[#e7d8bf] flex items-center gap-1.5">
              <span>环境微调 (湿度 / 温度 / 光照 / 水源 / 养料)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* 湿度 */}
              <div className="bg-[#1f1612] p-2 rounded-lg border border-[#432e22]">
                <div className="flex items-center justify-between text-[11px] text-[#c6a172] mb-1">
                  <span className="flex items-center gap-1">
                    <Droplet className="w-3 h-3 text-blue-400" />
                    <span>湿度</span>
                  </span>
                  <span className="text-[10px] text-[#8e6e52]">
                    {currentTerm.humidityDelta !== 0 ? `节气${currentTerm.humidityDelta > 0 ? '+' : ''}${currentTerm.humidityDelta}` : ''}
                  </span>
                </div>
                <select
                  value={activeTerrace.humidity}
                  onChange={e => updateTerraceCondition(activeTerrace.id, { humidity: e.target.value as Humidity })}
                  className="w-full bg-[#2a1d17] text-[#f4ede1] text-xs rounded px-2 py-1 border border-[#5f412d] focus:outline-none"
                >
                  <option value="dry">干燥 (&lt;40%)</option>
                  <option value="moderate">适中 (40~60%)</option>
                  <option value="humid">湿润 (60~80%)</option>
                  <option value="very_humid">高湿 (&gt;80%)</option>
                </select>
              </div>

              {/* 温度 */}
              <div className="bg-[#1f1612] p-2 rounded-lg border border-[#432e22]">
                <div className="flex items-center justify-between text-[11px] text-[#c6a172] mb-1">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-cyan-400" />
                    <span>温度</span>
                  </span>
                  <span className="text-[10px] text-[#8e6e52]">
                    {currentTerm.tempDelta !== 0 ? `节气${currentTerm.tempDelta > 0 ? '+' : ''}${currentTerm.tempDelta}` : ''}
                  </span>
                </div>
                <select
                  value={activeTerrace.temperature}
                  onChange={e => updateTerraceCondition(activeTerrace.id, { temperature: e.target.value as Temperature })}
                  className="w-full bg-[#2a1d17] text-[#f4ede1] text-xs rounded px-2 py-1 border border-[#5f412d] focus:outline-none"
                >
                  <option value="cold">冷凉 (&lt;12℃)</option>
                  <option value="mild">温和 (12~20℃)</option>
                  <option value="warm">温暖 (20~28℃)</option>
                  <option value="hot">炎热 (&gt;28℃)</option>
                </select>
              </div>

              {/* 光照 */}
              <div className="bg-[#1f1612] p-2 rounded-lg border border-[#432e22]">
                <div className="flex items-center justify-between text-[11px] text-[#c6a172] mb-1">
                  <span className="flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>光照</span>
                  </span>
                  <span className="text-[10px] text-[#8e6e52]">
                    {currentTerm.lightDelta !== 0 ? `节气${currentTerm.lightDelta > 0 ? '+' : ''}${currentTerm.lightDelta}` : ''}
                  </span>
                </div>
                <select
                  value={activeTerrace.light}
                  onChange={e => updateTerraceCondition(activeTerrace.id, { light: e.target.value as Light })}
                  className="w-full bg-[#2a1d17] text-[#f4ede1] text-xs rounded px-2 py-1 border border-[#5f412d] focus:outline-none"
                >
                  <option value="shade">遮阴</option>
                  <option value="partial">半日照</option>
                  <option value="full">全日照</option>
                  <option value="strong">强日照</option>
                </select>
              </div>

              {/* 水源 */}
              <div className="bg-[#1f1612] p-2 rounded-lg border border-[#432e22]">
                <div className="text-[11px] text-[#c6a172] mb-1">引水水源</div>
                <select
                  value={activeTerrace.waterSource}
                  onChange={e => updateTerraceCondition(activeTerrace.id, { waterSource: e.target.value as WaterSource })}
                  className="w-full bg-[#2a1d17] text-[#f4ede1] text-xs rounded px-2 py-1 border border-[#5f412d] focus:outline-none"
                >
                  <option value="rain">天然雨水</option>
                  <option value="stream">山涧溪水</option>
                  <option value="spring">深岩山泉</option>
                  <option value="snow">融冻雪水</option>
                </select>
              </div>

              {/* 养料 */}
              <div className="bg-[#1f1612] p-2 rounded-lg border border-[#432e22] col-span-2 sm:col-span-2">
                <div className="text-[11px] text-[#c6a172] mb-1">追施养料 (冲异形多棱)</div>
                <select
                  value={activeTerrace.fertilizer}
                  onChange={e => updateTerraceCondition(activeTerrace.id, { fertilizer: e.target.value as Fertilizer })}
                  className="w-full bg-[#2a1d17] text-[#f4ede1] text-xs rounded px-2 py-1 border border-[#5f412d] focus:outline-none"
                >
                  <option value="none">无养料 (原生态)</option>
                  <option value="organic">有机肥 (促稳产)</option>
                  <option value="phosphorus">磷肥 (坚果壳)</option>
                  <option value="potassium">钾肥 (深纹理)</option>
                  <option value="boron">含硼微量元素 (冲多棱/异形关键)</option>
                  <option value="compound">多种复合有机肥</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 种子铺与选种播种弹窗 */}
      {plantingModalTerraceId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3">
          <div className="bg-[#251a14] rounded-2xl max-w-md w-full border border-[#7c5435] p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#432e22] pb-3">
              <h3 className="text-base font-bold text-[#f4ede1] flex items-center gap-2">
                <Sprout className="w-5 h-5 text-amber-500" />
                <span>选择核桃良种播种</span>
              </h3>
              <button
                onClick={() => setPlantingModalTerraceId(null)}
                className="text-stone-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {VARIETIES.map(variety => {
                const owned = seeds[variety.id] || 0;
                const isLimited = variety.isSeasonLimited;

                return (
                  <div
                    key={variety.id}
                    className="bg-[#1f1612] p-3 rounded-xl border border-[#432e22] space-y-2 hover:border-[#7c5435] transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold text-[#f4ede1] flex items-center gap-1.5">
                          <span>{variety.name}</span>
                          {isLimited && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-700/40">
                              {variety.seasonName}限定
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#a58667] mt-0.5 leading-relaxed">
                          {variety.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs text-[#c6a172] font-semibold block">
                          存有：<span className="text-white">{owned}</span> 颗
                        </span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          单价：{variety.seedPrice} 钱
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#2e1d14]">
                      <button
                        onClick={() => buySeed(variety.id, 1)}
                        className="px-2.5 py-1 rounded bg-[#3b271d] hover:bg-[#523728] text-[#c6a172] text-[11px] border border-[#7c5435]/50 active:scale-95"
                      >
                        购买种子
                      </button>

                      <button
                        disabled={owned <= 0}
                        onClick={() => {
                          plantTerrace(plantingModalTerraceId, variety.id);
                          setPlantingModalTerraceId(null);
                        }}
                        className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${
                          owned > 0
                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md active:scale-95'
                            : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        播下此种
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
