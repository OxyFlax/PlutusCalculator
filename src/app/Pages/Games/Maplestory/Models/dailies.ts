import { Region } from "./region";
import { Task } from "./task";

export interface Dailies {
  characterName: string;
  dailyBosses: Task[];
  dailyTasks: Task[];
  dailyArcaneRiver: Task[];
}

export interface DailiesData {
  dailies: Dailies[];
  dailiesVersion: string;
  lastDailiesTrackerVisit: string;
  selecterCharacterIndex: number;
  editModeActive: boolean;
  mapleRegion: Region;
}