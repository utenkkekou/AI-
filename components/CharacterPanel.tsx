import React, { useState } from 'react';
import { Character } from '../types';
import { generateCharactersFromScript, generateImageForShot } from '../services/geminiService';
import { UserPlus, Wand2, Sparkles } from 'lucide-react';

interface CharacterPanelProps {
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  script: string;
}

export const CharacterPanel: React.FC<CharacterPanelProps> = ({ characters, setCharacters, script }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleAutoIdentify = async () => {
    if (!script) return;
    setIsAnalyzing(true);
    try {
      const chars = await generateCharactersFromScript(script);
      const newChars: Character[] = chars.map((c: any, i: number) => ({
        id: `char-${Date.now()}-${i}`,
        name: c.name,
        description: `${c.description}. Role: ${c.role}`,
        avatarUrl: ''
      }));
      setCharacters([...characters, ...newChars]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateAvatar = async (char: Character) => {
    setGeneratingId(char.id);
    try {
      const url = await generateImageForShot(`Character portrait, close up, ${char.description}, highly detailed, 8k`);
      setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, avatarUrl: url } : c));
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="h-full bg-slate-950 flex flex-col">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">Character Forge</h2>
          <p className="text-sm text-slate-500">Define and visualize your cast.</p>
        </div>
        <div className="flex gap-2">
            <button 
              onClick={handleAutoIdentify}
              disabled={!script || isAnalyzing}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
            >
               {isAnalyzing ? <Wand2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
               Auto-Identify from Script
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors">
              <UserPlus size={16} /> Add Manual
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
         {characters.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
              <UserPlus size={48} className="mb-4 opacity-50" />
              <p>No characters yet.</p>
              <p className="text-xs mt-1">Write a script and use "Auto-Identify" or add them manually.</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map(char => (
                <div key={char.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
                   <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden relative group">
                      {char.avatarUrl ? (
                        <img src={char.avatarUrl} alt={char.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                           <UserPlus size={32} />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                           onClick={() => handleGenerateAvatar(char)}
                           disabled={generatingId === char.id}
                           className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-medium"
                         >
                           {generatingId === char.id ? 'Generating...' : (char.avatarUrl ? 'Regenerate' : 'Generate Look')}
                         </button>
                      </div>
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-200">{char.name}</h3>
                     <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-3">
                       {char.description}
                     </p>
                   </div>
                </div>
              ))}
           </div>
         )}
      </div>
    </div>
  );
};