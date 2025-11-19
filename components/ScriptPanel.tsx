import React, { useState } from 'react';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { generateScriptExpansion } from '../services/geminiService';

interface ScriptPanelProps {
  script: string;
  setScript: (s: string) => void;
  onGenerateStoryboard: () => void;
}

export const ScriptPanel: React.FC<ScriptPanelProps> = ({ script, setScript, onGenerateStoryboard }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleAIExpand = async () => {
    if (!prompt && !script) return;
    setIsGenerating(true);
    const result = await generateScriptExpansion(script, prompt || "Expand this into a detailed video script.");
    setScript(result);
    setIsGenerating(false);
    setPrompt('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">Creative Studio</h2>
          <p className="text-sm text-slate-500">Draft your script or let AI brainstorm.</p>
        </div>
        <button
          onClick={onGenerateStoryboard}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
        >
          Generate Storyboard <ArrowRight size={16} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* AI Controls */}
        <div className="w-80 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
              AI Creative Assistant
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'Make the tone more suspenseful', 'Add a plot twist about a lost artifact'..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none h-32 resize-none"
            />
            <button
              onClick={handleAIExpand}
              disabled={isGenerating}
              className="mt-3 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              {isGenerating ? 'Thinking...' : 'Generate Ideas'}
            </button>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Modes</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-xs text-slate-400 hover:text-purple-400 transition-colors">
                ✨ Creative Fission (Brainstorm)
              </button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-xs text-slate-400 hover:text-purple-400 transition-colors">
                📝 Rewrite & Polish
              </button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-xs text-slate-400 hover:text-purple-400 transition-colors">
                🔍 Grammar & Tone Check
              </button>
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-950">
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Start typing your story here..."
            className="w-full h-full bg-transparent border-none outline-none text-lg leading-relaxed text-slate-300 font-serif resize-none placeholder-slate-700"
          />
        </div>
      </div>
    </div>
  );
};