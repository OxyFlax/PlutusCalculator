import { Task } from "./taskModels";

export interface Region {
    resetUtcOffset: number;
    name: string;
}

export interface Dailies {
    characterName: string;
    dailyBosses: Task[];
    dailyTasks: Task[];
    dailyArcaneRiver: Task[];
}

export interface Weeklies {
    characterName: string;
    weeklyBosses: Task[];
    weeklyTasks: Task[];
  }