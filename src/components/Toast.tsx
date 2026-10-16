import React from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useGame();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#3b2416] via-[#523321] to-[#3b2416] border border-[#c6a172]/60 text-[#f4ede1] shadow-2xl shadow-black/60 flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-bounce backdrop-blur-md max-w-[90vw] text-center">
      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
      <span>{toastMessage}</span>
    </div>
  );
};
