export interface Quest {
  id: string;
  text: string;
  reward: number;
  completed: boolean;
}

export interface Act {
  id: number;
  title: string;
  quests: Quest[];
  boss?: boolean;
}

export type ActProgress = {
  act: number;
};