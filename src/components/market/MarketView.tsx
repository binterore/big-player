import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { NPC_TRADERS } from '../../services/marketEngine';
import { Store, Gavel, Timer, Coins, ArrowUpRight, Flame, ShieldAlert } from 'lucide-react';

export const MarketView: React.FC = () => {
  const {
    marketListings,
    walnuts,
    coins,
    buyMarketItem,
    sellWalnutDirect,
    activeAuctionLot,
    startAuctionLot,
    playerBidOnAuction,
    claimAuctionProceeds
  } = useGame();

  const [marketTab, setMarketTab] = useState<'bazaar' | 'auction'>('bazaar');
  const [selectedTraderId, setSelectedTraderId] = useState<string>(NPC_TRADERS[0].id);

  // 送拍弹窗状态
  const [auctionModalOpen, setAuctionModalOpen] = useState(false);
  const [auctionItemId, setAuctionItemId] = useState<string>('');
  const [reservePriceInput, setReservePriceInput] = useState<number>(500);

  // 可出售的核桃 (已开核或生核)
  const sellableWalnuts = walnuts;
  const valuableWalnuts = walnuts.filter(w => !w.isUncracked && (w.estimatedValue >= 200 || w.hasCertificate));

  return (
    <div className="space-y-4 pb-20">
      {/* 顶部二级导航 */}
      <div className="flex bg-[#251a14] p-1 rounded-xl border border-[#5f412d] shadow">
        <button
          onClick={() => setMarketTab('bazaar')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            marketTab === 'bazaar'
              ? 'bg-[#432e22] text-amber-300 shadow border border-[#c6a172]/40'
              : 'text-[#9b7b62] hover:text-[#d7be99]'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>聚宝市集 · NPC商肆</span>
        </button>

        <button
          onClick={() => setMarketTab('auction')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            marketTab === 'auction'
              ? 'bg-[#432e22] text-amber-300 shadow border border-[#c6a172]/40'
              : 'text-[#9b7b62] hover:text-[#d7be99]'
          }`}
        >
          <Gavel className="w-3.5 h-3.5" />
          <span>春秋拍卖会 · 实时竞拍</span>
        </button>
      </div>

      {marketTab === 'bazaar' ? (
        /* 子界面 1：聚宝市集 */
        <div className="space-y-4">
          {/* 三位行商 NPC 选项 */}
          <div className="grid grid-cols-3 gap-2">
            {NPC_TRADERS.map(trader => {
              const isSelected = trader.id === selectedTraderId;
              return (
                <button
                  key={trader.id}
                  onClick={() => setSelectedTraderId(trader.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#432e22] border-amber-500 shadow-md text-white'
                      : 'bg-[#1f1612] border-[#432e22] text-[#a58667] hover:border-[#7c5435]'
                  }`}
                >
                  <div className="text-xl mb-1">{trader.avatar}</div>
                  <div className="text-xs font-bold truncate">{trader.name}</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">加价 {(trader.priceModifier * 100 - 100).toFixed(0)}%</div>
                </button>
              );
            })}
          </div>

          {/* 行商当面收购行囊货品 */}
          <div className="bg-[#251a14] rounded-2xl p-4 border border-[#5f412d] space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#432e22] pb-2">
              <span className="text-xs font-bold text-[#e7d8bf]">当面出售行囊核桃</span>
              <span className="text-[10px] text-[#a58667]">点击立结现银</span>
            </div>

            {sellableWalnuts.length === 0 ? (
              <div className="py-4 text-center text-xs text-stone-500">行囊空空如也，暂无可售文玩。</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {sellableWalnuts.map(w => {
                  const trader = NPC_TRADERS.find(t => t.id === selectedTraderId) || NPC_TRADERS[0];
                  const payout = Math.round((w.estimatedValue || 50) * trader.priceModifier);

                  return (
                    <div
                      key={w.id}
                      className="p-2.5 rounded-xl bg-[#1a120d] border border-[#432e22] flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#f4ede1]">{w.name}</div>
                        <div className="text-[10px] text-[#a58667] mt-0.5">
                          {w.isUncracked ? '生核未开' : `${w.edgeWidth}mm · ${w.postureName?.split('·')[0]}`}
                        </div>
                      </div>
                      <button
                        onClick={() => sellWalnutDirect(w.id, selectedTraderId)}
                        className="px-2.5 py-1 rounded bg-[#3b271d] hover:bg-amber-700 text-amber-300 hover:text-white text-[11px] font-bold border border-[#7c5435] transition-all"
                      >
                        卖 {payout} 钱
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 市集行脚商人寄售货架 (赌生核或买成核) */}
          <div className="bg-[#251a14] rounded-2xl p-4 border border-[#5f412d] space-y-3 shadow-xl">
            <div className="text-xs font-bold text-[#e7d8bf]">客商寄售货架 (淘货与赌生核)</div>
            <div className="space-y-2">
              {marketListings.map(listing => (
                <div
                  key={listing.id}
                  className="p-3 rounded-xl bg-[#1a120d] border border-[#432e22] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌰</span>
                    <div>
                      <div className="text-xs font-bold text-[#f4ede1] flex items-center gap-1.5">
                        <span>{listing.item.name}</span>
                        <span className="text-[10px] text-stone-400">({listing.sellerName})</span>
                      </div>
                      <div className="text-[10px] text-[#a58667] mt-0.5">
                        {listing.item.estimatePreview || `${listing.item.edgeWidth}mm · ${listing.item.gradeName}`}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => buyMarketItem(listing.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow active:scale-95 transition-all"
                  >
                    购入 {listing.price} 钱
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 子界面 2：春秋拍卖大会 (实时竞价大厅) */
        <div className="space-y-4">
          {activeAuctionLot ? (
            /* 正在进行拍卖 */
            <div className="bg-[#251a14] rounded-2xl p-5 border-2 border-amber-500/80 space-y-4 shadow-2xl">
              {/* 顶部倒计时与拍品名 */}
              <div className="flex items-center justify-between border-b border-[#432e22] pb-3">
                <div className="flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-amber-500 animate-bounce" />
                  <span className="text-sm font-bold text-[#f4ede1]">
                    {activeAuctionLot.walnutItem?.name || activeAuctionLot.antiqueItem?.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-950 text-red-300 border border-red-700/50">
                  <Timer className="w-3.5 h-3.5" />
                  <span>{activeAuctionLot.secondsRemaining} 秒</span>
                </div>
              </div>

              {/* 当前最高出价 */}
              <div className="text-center py-4 bg-[#1a120d] rounded-xl border border-[#432e22] space-y-1">
                <div className="text-xs text-[#a58667]">当前最高竞价</div>
                <div className="text-3xl font-black text-amber-400 tracking-wider">
                  {activeAuctionLot.currentBid.toLocaleString()} <span className="text-xs font-normal text-stone-400">文铜钱</span>
                </div>
                <div className="text-xs text-[#c6a172] pt-1">
                  领牌者：<span className="font-bold text-white">{activeAuctionLot.highestBidder}</span>
                </div>
              </div>

              {/* 实时叫价记录流 */}
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {activeAuctionLot.bidHistory.map((bid, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded bg-[#1f1612] border border-[#3b271d]"
                  >
                    <span className="text-[#c6a172]">{bid.bidder}</span>
                    <span className="font-bold text-amber-300">{bid.amount} 钱</span>
                  </div>
                ))}
              </div>

              {/* 操作按钮：举牌加价 或 敲槌交割 */}
              {activeAuctionLot.status === 'active' ? (
                <div className="grid grid-cols-1 gap-2 pt-2">
                  <button
                    onClick={playerBidOnAuction}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 via-amber-600 to-red-700 hover:from-red-600 hover:to-red-600 text-white font-extrabold text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Flame className="w-4 h-4 text-amber-300" />
                    <span>举牌加价 (+10%)</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={claimAuctionProceeds}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white font-bold text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>拍卖结束 · 敲槌结算交割</span>
                </button>
              )}
            </div>
          ) : (
            /* 尚未开启拍卖：送拍准备 */
            <div className="bg-[#251a14] rounded-2xl p-6 border border-[#5f412d] space-y-4 text-center shadow-xl">
              <div className="w-16 h-16 rounded-full bg-[#3b271d] mx-auto flex items-center justify-center text-3xl border border-[#7c5435]">
                🏛️
              </div>
              <div>
                <h3 className="text-base font-bold text-[#f4ede1]">大中堂春秋拍卖会</h3>
                <p className="text-xs text-[#a58667] mt-1 max-w-sm mx-auto leading-relaxed">
                  各方巨贾、名流剑痴汇聚一堂。送上你手中价值连城的异形核桃或国宝，设定托底保护价，坐看全场叫价！
                </p>
              </div>

              <button
                onClick={() => setAuctionModalOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg active:scale-95 transition-all inline-flex items-center gap-1.5"
              >
                <Gavel className="w-4 h-4" />
                <span>送拍珍品 · 设定底价</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 送拍选择与托底价设定弹窗 */}
      {auctionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#251a14] rounded-2xl max-w-md w-full border border-[#7c5435] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#432e22] pb-3">
              <h3 className="text-sm font-bold text-[#f4ede1]">选择送拍拍品</h3>
              <button
                onClick={() => setAuctionModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {valuableWalnuts.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-500">
                暂无达到送拍门槛的文玩（需已开核且估值 ≥ 200 或持有鉴定证书）。
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {valuableWalnuts.map(w => {
                    const isSelected = w.id === auctionItemId;
                    return (
                      <div
                        key={w.id}
                        onClick={() => {
                          setAuctionItemId(w.id);
                          setReservePriceInput(w.estimatedValue);
                        }}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#432e22] border-amber-500 text-white'
                            : 'bg-[#1a120d] border-[#432e22] text-[#a58667]'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-[#f4ede1]">{w.name}</div>
                          <div className="text-[10px] text-amber-400">{w.edgeWidth}mm · 估值 {w.estimatedValue} 钱</div>
                        </div>
                        {isSelected && <span className="text-amber-400 font-bold text-xs">已选</span>}
                      </div>
                    );
                  })}
                </div>

                {auctionItemId && (
                  <div className="bg-[#1a120d] p-3 rounded-xl border border-[#432e22] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#c6a172]">托底保留价 (低于此价不成交)：</span>
                      <span className="text-amber-400 font-bold">{reservePriceInput} 钱</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="15000"
                      step="100"
                      value={reservePriceInput}
                      onChange={e => setReservePriceInput(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                )}

                <button
                  disabled={!auctionItemId}
                  onClick={() => {
                    startAuctionLot(auctionItemId, true, reservePriceInput);
                    setAuctionModalOpen(false);
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    auctionItemId
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg active:scale-95'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  确 认 送 拍 · 开 槌 竞 标
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
