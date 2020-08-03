import { Task } from "./task";

export interface Dailies {
    characterName: string;
    dailyBosses: Task[];
    dailyTasks: Task[];
    dailyArcaneRiver: Task[];
  }