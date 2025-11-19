export enum ViewMode {
  SCRIPT = 'SCRIPT',
  CHARACTERS = 'CHARACTERS',
  STORYBOARD = 'STORYBOARD',
  EDITOR = 'EDITOR',
  ASSETS = 'ASSETS'
}

export interface Character {
  id: string;
  name: string;
  description: string; // Prompt for the character
  avatarUrl: string;
}

export interface Shot {
  id: string;
  title: string;
  description: string; // Visual description
  duration: number; // in seconds
  imageUrl?: string;
  type: 'image' | 'video';
  status: 'draft' | 'generating' | 'done';
}

export interface Project {
  id: string;
  name: string;
  script: string;
  characters: Character[];
  storyboard: Shot[];
  timeline: string[]; // Array of Shot IDs in order
}

export enum AIStatus {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}