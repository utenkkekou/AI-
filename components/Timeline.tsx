import React from 'react';
import { Shot } from '../types';
import { Play, SkipBack, SkipForward, ZoomIn, ZoomOut, Scissors, Layers } from 'lucide-react';

interface TimelineProps {
  timelineShotIds: string[];
  allShots: Shot[];
  onRemoveShot: (index: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ timelineShotIds, allShots, onRemoveShot }) => {
  const timelineShots = timelineShotIds
    .map(id => allShots.find(s => s.id === id))
    .filter((s): s is Shot => !!s);

  return (
    <div className="h-72 bg-slate-900 border-t border-slate-800 flex flex-col shrink-0 z-10">
      {/* Timeline Toolbar */}
      <div className="h-12 border-b border-slate-800 flex items-center px-4 justify-between bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
             <button className="text-slate-400 hover:text-white p-1"><SkipBack size={18} /></button>
             <button className="text-white bg-purple-600 hover:bg-purple-500 p-1.5 rounded-full"><Play size={16} fill="currentColor" /></button>
             <button className="text-slate-400 hover:text-white p-1"><SkipForward size={18} /></button>
          </div>
          <div className="h-4 w-[1px] bg-slate-700 mx-2"></div>
          <div className="text-xs font-mono text-purple-400">00:00:00:00</div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex gap-1">
              <button className="text-slate-400 hover:text-white p-1"><Scissors size={16} /></button>
              <button className="text-slate-400 hover:text-white p-1"><Layers size={16} /></button>
           </div>
           <div className="flex items-center gap-2">
              <ZoomOut size={14} className="text-slate-500" />
              <div className="w-24 h-1 bg-slate-700 rounded-full">
                <div className="w-12 h-full bg-slate-500 rounded-full"></div>
              </div>
              <ZoomIn size={14} className="text-slate-500" />
           </div>
        </div>
      </div>

      {/* Tracks Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden relative bg-slate-950 p-4 custom-scrollbar">
        
        {/* Time Ruler */}
        <div className="absolute top-0 left-0 right-0 h-6 border-b border-slate-800 flex text-[10px] text-slate-500 select-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex-1 border-l border-slate-800 pl-1">
              00:0{i}
            </div>
          ))}
        </div>

        {/* Video Track */}
        <div className="mt-8 flex gap-1 min-w-full pb-4">
           {timelineShots.length === 0 ? (
             <div className="w-full h-32 border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-sm">
               Drag shots from Storyboard here or click "+" on shots
             </div>
           ) : (
             timelineShots.map((shot, index) => (
               <div 
                key={`${shot.id}-${index}`} 
                className="relative group flex-shrink-0 h-32 rounded-md overflow-hidden border-2 border-slate-800 bg-slate-900 hover:border-purple-500 cursor-pointer transition-all"
                style={{ width: `${shot.duration * 30}px` }} // Rough scale
               >
                 {shot.imageUrl ? (
                    <img src={shot.imageUrl} alt={shot.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500 text-xs p-2 text-center">
                      {shot.title}
                    </div>
                 )}
                 <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                    <p className="text-[10px] text-white truncate">{shot.title}</p>
                 </div>
                 <button 
                  onClick={(e) => { e.stopPropagation(); onRemoveShot(index); }}
                  className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
                 >
                   <Scissors size={10} />
                 </button>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};