import { Region } from "./region";

export interface TaskData {
    characters: CharacterData[];
    version: string;
    lastTrackerVisit: string;
    selectedCharacterIndex: number;
    mapleRegion: Region;
    editModeActive: boolean;
}

export interface CharacterData {
    characterName: string;
    taskGroups: TaskGroup[];
}

export interface TaskGroup {
    title: string;
    tasks: Task[];
    allDisabled: boolean;
    // TODO: potentially add boolean for if the task is enabled or not, this would allow .some taskgroup.enabled
}

export interface Task {
    name: string;
    image: string;
    completed: boolean;
    enabled: boolean;
    type: string;
    displayCondition: string;
}