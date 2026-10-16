import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Trophy, Award, Flame, Shield, CheckCircle, ChevronUp, Sparkles } from 'lucide-react';

export const SocietyView: React.FC = () => {
  const {
    skills,
    skillPoints,
    ingots,
    societyTasks,
    societyMembers,
    societyCoins,
    upgradeSkillNode,
    claimSocietyTask,
    upgradeSocietyTask
  } = useGame();

  const [tab, setTab] = useState<'skills' | 'society'>('skills');

  // 计算协会全员总分
  const totalSocietyScore = societyMembers.reduce((sum, m) => sum + m.score, 0);

  // 模拟全服 10 个同组协会排行榜
  const mockGuildLeaderboard = [
    { rank: 1, name: '【天下第一藏】总会', score: 320, isCurrent: false },
    { rank: 2, name: '【金石同盟】华东分会', score: 285, isCurrent: false },
    { rank: 3, name: '【我所在】南山收藏雅集', score: totalSocietyScore + 180, isCurrent: true },
    { rank: 4, name: '【古玩八家】联合会', score: 190, isCurrent: false },
    { rank: 5, name: '【青花阁】雅士会', score: 165, isCurrent: false },
    { rank: 6, name: '【塞外刀剑】研习社', score: 140, isCurrent: false },
    { rank: 7, name: '【江南墨客】总舵', score: 110, isCurrent: false },
    { rank: 8, name: '【百草堂】林木行会', score: 85, isCurrent: false },
    { rank: 9, name: '【寻宝斋】清溪分舵', score: 60, isCurrent: false },
    { rank: 10, name: '【落拓行】散人会', score: 30, isCurrent: false }
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4 pb-20">
      {/* 顶部二级导航 */}
      <div className="flex bg-[#251a14] p-1 rounded-xl border border-[#5f412d] shadow">
        <button
          onClick={() => setTab('skills')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            tab === 'skills'
              ? 'bg-[#432e22] text-amber-300 shadow border border-[#c6a172]/40'
              : 'text-[#9b7b62] hover:text-[#d7be99]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>鲁班技艺阁 · 五脉专精</span>
        </button>

        <button
          onClick={() => setTab('society')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            tab === 'society'
              ? 'bg-[#432e22] text-amber-300 shadow border border-[#c6a172]/40'
              : 'text-[#9b7b62] hover:text-[#d7be99]'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>收藏家协会 · 周联赛评比</span>
        </button>
      </div>

      {tab === 'skills' ? (
        /* 子界面 1：技艺树 */
        <div className="space-y-3">
          <div className="bg-[#251a14] p-3 rounded-2xl border border-[#5f412d] flex items-center justify-between text-xs">
            <span className="text-[#a58667]">当前结余技艺点：</span>
            <span className="text-blue-400 font-extrabold text-sm">{skillPoints} 点</span>
          </div>

          <div className="space-y-2.5">
            {skills.map(node => {
              const isMax = node.level >= node.maxLevel;
              const canAfford = skillPoints >= node.costPoints;

              return (
                <div
                  key={node.branch}
                  className="bg-[#251a14] rounded-2xl p-4 border border-[#5f412d] space-y-2 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[#f4ede1] flex items-center gap-1.5">
                        <span>{node.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3b271d] text-amber-300 border border-[#7c5435]/40 font-mono">
                          Lv.{node.level} / {node.maxLevel}
                        </span>
                      </h3>
                      <p className="text-[11px] text-[#a58667] mt-0.5">{node.description}</p>
                    </div>

                    {!isMax ? (
                      <button
                        disabled={!canAfford}
                        onClick={() => upgradeSkillNode(node.branch)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          canAfford
                            ? 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 text-white shadow active:scale-95'
                            : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        提升 ({node.costPoints} 点)
                      </button>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-bold px-2 py-1 rounded bg-amber-950/40 border border-amber-800">
                        大圆满
                      </span>
                    )}
                  </div>

                  {/* 效果描述 */}
                  <div className="text-[11px] text-[#c6a172] bg-[#1a120d] p-2 rounded-lg border border-[#3b271d]">
                    ✦ {node.effectDesc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 子界面 2：协会评比联赛 */
        <div className="space-y-4">
          {/* 协会概况 */}
          <div className="bg-[#251a14] rounded-2xl p-4 border border-[#5f412d] space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#f4ede1] flex items-center gap-2">
                  <span>南山收藏雅集</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    ★★★ 三星名流协会
                  </span>
                </h3>
                <div className="text-[11px] text-[#a58667] mt-0.5">
                  全会本周总积分：<span className="text-amber-400 font-bold">{totalSocietyScore + 180}</span> 分
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-purple-300 font-bold block">
                  协会币：{societyCoins}
                </span>
                <span className="text-[10px] text-stone-400">跨周不清零</span>
              </div>
            </div>
          </div>

          {/* 协会共享任务池 */}
          <div className="bg-[#251a14] rounded-2xl p-4 border border-[#5f412d] space-y-3 shadow-xl">
            <div className="text-xs font-bold text-[#e7d8bf]">本周协会委托任务池：</div>
            <div className="space-y-2">
              {societyTasks.map(task => {
                const pts = task.points * (task.isUpgraded ? 2 : 1);
                return (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-[#1a120d] border border-[#432e22] space-y-2 hover:border-[#7c5435] transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#f4ede1] flex items-center gap-1.5">
                          <span>{task.title}</span>
                          {task.isUpgraded && (
                            <span className="text-[9px] px-1 rounded bg-red-950 text-red-300 border border-red-700/50">
                              分值翻倍
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#a58667] mt-0.5 leading-relaxed">
                          {task.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-amber-400">+{pts} 分</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#2e1d14]">
                      {!task.isUpgraded && !task.completed && (
                        <button
                          onClick={() => upgradeSocietyTask(task.id)}
                          className="text-[10px] text-red-300 hover:text-red-200 px-2 py-0.5 rounded bg-red-950/60 border border-red-800/60"
                        >
                          花 {task.points * 3} 元宝翻倍
                        </button>
                      )}

                      {!task.completed ? (
                        <button
                          onClick={() => claimSocietyTask(task.id)}
                          className="ml-auto px-3.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow active:scale-95"
                        >
                          提交并结赏
                        </button>
                      ) : (
                        <span className="ml-auto text-xs text-emerald-400 font-bold">
                          ✓ 已完成本周贡献
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 十大协会本周评比风云榜 */}
          <div className="bg-[#251a14] rounded-2xl p-4 border border-[#5f412d] space-y-2 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold text-[#e7d8bf] border-b border-[#432e22] pb-2">
              <span>同组十强排位赛 (周日 21:00 结算升降级)</span>
              <span className="text-[10px] text-emerald-400">前三晋级 / 后三降级</span>
            </div>

            <div className="space-y-1">
              {mockGuildLeaderboard.map((guild, idx) => (
                <div
                  key={guild.name}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs ${
                    guild.isCurrent
                      ? 'bg-amber-950/70 border border-amber-600 text-amber-200 font-bold'
                      : 'text-[#a58667]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-4 font-mono ${idx < 3 ? 'text-amber-400 font-bold' : ''}`}>
                      {idx + 1}
                    </span>
                    <span>{guild.name}</span>
                  </div>
                  <span className="font-mono">{guild.score} 分</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
