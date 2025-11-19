import React from 'react';
import { ViewMode } from '../types';
import { LayoutTemplate, Users, Clapperboard, Wand2, FolderOpen, Settings } from 'lucide-react';

interface NavigationProps {
  currentMode: ViewMode;
  setMode: (mode: ViewMode) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { mode: ViewMode.SCRIPT, icon: <LayoutTemplate size={20} />, label: 'Script & Creative' },
    { mode: ViewMode.CHARACTERS, icon: <Users size={20} />, label: 'Characters' },
    { mode: ViewMode.STORYBOARD, icon: <Clapperboard size={20} />, label: 'Storyboard' },
    { mode: ViewMode.EDITOR, icon: <Wand2 size={20} />, label: 'Image Editor' },
    { mode: ViewMode.ASSETS, icon: <FolderOpen size={20} />, label: 'Assets & Export' },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full flex-shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          VenusAI
        </h1>
        <p className="text-xs text-slate-500 mt-1">Creative Production OS</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => setMode(item.mode)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentMode === item.mode
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 transition-colors">
          <Settings size={20} />
          <span className="font-medium text-sm">Settings</span>
        </button>
        <div className="mt-4 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-xs font-bold text-white">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200">John Doe</span>
              <span className="text-[10px] text-slate-500">Pro Plan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};