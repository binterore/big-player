import React from 'react';
import { Sprout, Hammer, Eye, Landmark, Store, Mail, Trophy } from 'lucide-react';

export type TabType = 'garden' | 'workshop' | 'appraisal' | 'museum' | 'market' | 'collectors' | 'society';

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unopenedLetterCount: number;
  readyHarvestCount: number;
  uncrackedWalnutCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  unopenedLetterCount,
  readyHarvestCount,
  uncrackedWalnutCount
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'garden', label: '台地', icon: <Sprout className="w-5 h-5" />, badge: readyHarvestCount },
    { id: 'workshop', label: '开核', icon: <Hammer className="w-5 h-5" />, badge: uncrackedWalnutCount },
    { id: 'appraisal', label: '品鉴', icon: <Eye className="w-5 h-5" /> },
    { id: 'museum', label: '展馆', icon: <Landmark className="w-5 h-5" /> },
    { id: 'market', label: '市集', icon: <Store className="w-5 h-5" /> },
    { id: 'collectors', label: '藏家', icon: <Mail className="w-5 h-5" />, badge: unopenedLetterCount },
    { id: 'society', label: '协会', icon: <Trophy className="w-5 h-5" /> }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#251a14]/95 backdrop-blur-lg border-t border-[#5f412d]/60 px-2 py-1.5 shadow-2xl">
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all ${
                isActive
                  ? 'text-[#f4ede1] bg-[#432e22] shadow-inner border border-[#c6a172]/40 scale-105'
                  : 'text-[#9b7b62] hover:text-[#d7be99]'
              }`}
            >
              {tab.icon}
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-amber-300 font-bold' : ''}`}>
                {tab.label}
              </span>

              {/* 红点徽标 */}
              {tab.badge !== undefined && tab.badge > 0 ? (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#251a14] animate-pulse">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
