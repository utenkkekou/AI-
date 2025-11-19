import React, { useState } from 'react';
import { Shot, AIStatus } from '../types';
import { generateImageForShot } from '../services/geminiService';
import { Plus, Image as ImageIcon, Video, Loader2, PlayCircle, Trash2 } from 'lucide-react';

interface StoryboardPanelProps {
  shots: Shot[];
  setShots: React.Dispatch<React.SetStateAction<Shot[]>>;
  onAddToTimeline: (shotId: string) => void;
}

export const StoryboardPanel: React.FC<StoryboardPanelProps> = ({ shots, setShots, onAddToTimeline }) => {
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleGenerateImage = async (shot: Shot) => {
    setGeneratingId(shot.id);
    try {
      const imageUrl = await generateImageForShot(shot.description);
      setShots(prev => prev.map(s => s.id === shot.id ? { ...s, imageUrl, status: 'done' } : s));
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingId(null);
    }
  };

  const handleDeleteShot = (id: string) => {
    setShots(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">Storyboard</h2>
          <p className="text-sm text-slate-500">Visualize your shots. Generate images and organize sequence.</p>
        </div>
        <button 
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors"
          onClick={() => {
            const newShot: Shot = {
              id: Date.now().toString(),
              title: `Shot ${shots.length + 1}`,
              description: "New shot description...",
              duration: 3,
              type: 'image',
              status: 'draft'
            };
            setShots([...shots, newShot]);
          }}
        >
          <Plus size={16} /> Add Shot
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shots.map((shot) => (
            <div key={shot.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-all group">
              <div className="aspect-video bg-slate-950 relative group">
                {shot.imageUrl ? (
                  <img src={shot.imageUrl} alt={shot.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-4 text-center">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-xs">No image generated</span>
                  </div>
                )}

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                  <button
                    onClick={() => handleGenerateImage(shot)}
                    disabled={generatingId === shot.id}
                    className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-500"
                    title="Generate Image"
                  >
                     {generatingId === shot.id ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
                  </button>
                  <button
                    onClick={() => {/* Mock Video Gen */}}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500"
                    title="Animate to Video (Veo)"
                  >
                    <Video size={18} />
                  </button>
                  <button
                    onClick={() => onAddToTimeline(shot.id)}
                    className="p-2 bg-green-600 text-white rounded-full hover:bg-green-500"
                    title="Add to Timeline"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-200 text-sm">{shot.title}</h3>
                  <button onClick={() => handleDeleteShot(shot.id)} className="text-slate-600 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-xs text-slate-500 line-clamp-3 mb-3 min-h-[3em]">
                  {shot.description}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-800 pt-2">
                  <span className="flex items-center gap-1"><PlayCircle size={12} /> {shot.duration}s</span>
                  <span className={`px-2 py-0.5 rounded-full uppercase text-[10px] font-bold ${
                    shot.status === 'done' ? 'bg-green-900/30 text-green-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {shot.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};