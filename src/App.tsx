import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { Navigation, TabType } from './components/Navigation';
import { GardenView } from './components/garden/GardenView';
import { WorkshopView } from './components/workshop/WorkshopView';
import { AppraisalView } from './components/appraisal/AppraisalView';
import { MuseumView } from './components/museum/MuseumView';
import { MarketView } from './components/market/MarketView';
import { CollectorsView } from './components/collectors/CollectorsView';
import { SocietyView } from './components/society/SocietyView';

const GameMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('garden');
  const { walnuts, terraces, letters } = useGame();

  const uncrackedCount = walnuts.filter(w => w.isUncracked).length;
  const readyHarvestCount = terraces.filter(t => t.status === 'ready').length;
  const unopenedLettersCount = letters.filter(l => !l.rewardClaimed || l.repliedIndex === undefined).length;

  return (
    <div className="min-h-screen bg-[#1a120d] text-[#e7d8bf] flex flex-col justify-between">
      <Header />
      <Toast />

      <main className="flex-1 max-w-xl w-full mx-auto p-3 sm:p-4">
        {activeTab === 'garden' && <GardenView />}
        {activeTab === 'workshop' && <WorkshopView />}
        {activeTab === 'appraisal' && <AppraisalView />}
        {activeTab === 'museum' && <MuseumView />}
        {activeTab === 'market' && <MarketView />}
        {activeTab === 'collectors' && <CollectorsView />}
        {activeTab === 'society' && <SocietyView />}
      </main>

      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        uncrackedWalnutCount={uncrackedCount}
        readyHarvestCount={readyHarvestCount}
        unopenedLetterCount={unopenedLettersCount}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <GameMain />
    </GameProvider>
  );
};

export default App;
