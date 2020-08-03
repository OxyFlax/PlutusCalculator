import { Task } from "./task";

export interface Weeklies {
    characterName: string;
    weeklyBosses: Task[];
    weeklyTasks: Task[];
  }