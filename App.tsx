import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { ScriptPanel } from './components/ScriptPanel';
import { StoryboardPanel } from './components/StoryboardPanel';
import { Timeline } from './components/Timeline';
import { CharacterPanel } from './components/CharacterPanel';
import { ViewMode, Project, Shot, Character } from './types';
import { generateStoryboardFromScript } from './services/geminiService';

const App: React.FC = () => {
  const [currentMode, setMode] = useState<ViewMode>(ViewMode.SCRIPT);
  
  // Central State (would use Context or Redux in larger app)
  const [project, setProject] = useState<Project>({
    id: 'proj_1',
    name: 'Untitled Project',
    script: '',
    characters: [],
    storyboard: [],
    timeline: []
  });

  // Helpers
  const updateProject = (updates: Partial<Project>) => {
    setProject(prev => ({ ...prev, ...updates }));
  };

  const handleGenerateStoryboard = async () => {
    if (!project.script) return;
    
    setMode(ViewMode.STORYBOARD); // Switch view
    const scenes = await generateStoryboardFromScript(project.script);
    
    const newShots: Shot[] = scenes.map((scene: any, index: number) => ({
      id: `shot-${Date.now()}-${index}`,
      title: scene.title || `Shot ${index + 1}`,
      description: scene.description,
      duration: scene.duration || 3,
      type: 'image',
      status: 'draft'
    }));

    updateProject({ storyboard: [...project.storyboard, ...newShots] });
  };

  const addToTimeline = (shotId: string) => {
    updateProject({ timeline: [...project.timeline, shotId] });
  };

  const removeFromTimeline = (index: number) => {
    const newTimeline = [...project.timeline];
    newTimeline.splice(index, 1);
    updateProject({ timeline: newTimeline });
  };

  const renderContent = () => {
    switch (currentMode) {
      case ViewMode.SCRIPT:
        return (
          <ScriptPanel 
            script={project.script} 
            setScript={(s) => updateProject({ script: s })}
            onGenerateStoryboard={handleGenerateStoryboard}
          />
        );
      case ViewMode.STORYBOARD:
        return (
          <StoryboardPanel 
            shots={project.storyboard} 
            setShots={(setter) => {
                // Handling the functional update for shots state properly within the project object
                if (typeof setter === 'function') {
                  setProject(prev => ({ ...prev, storyboard: setter(prev.storyboard) }));
                } else {
                   updateProject({ storyboard: setter });
                }
            }}
            onAddToTimeline={addToTimeline}
          />
        );
      case ViewMode.CHARACTERS:
        return (
          <CharacterPanel 
            characters={project.characters}
            setCharacters={(setter) => {
               if (typeof setter === 'function') {
                  setProject(prev => ({ ...prev, characters: setter(prev.characters) }));
               } else {
                  updateProject({ characters: setter });
               }
            }}
            script={project.script}
          />
        );
      case ViewMode.EDITOR:
      case ViewMode.ASSETS:
        return (
          <div className="flex items-center justify-center h-full text-slate-500">
             <div className="text-center">
               <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
               <p>This module is under development in this prototype.</p>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Navigation currentMode={currentMode} setMode={setMode} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Content View */}
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>

        {/* Bottom Timeline (Always visible) */}
        <Timeline 
          timelineShotIds={project.timeline}
          allShots={project.storyboard}
          onRemoveShot={removeFromTimeline}
        />
      </div>
    </div>
  );
};

export default App;