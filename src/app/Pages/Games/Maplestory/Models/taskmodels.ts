import { Region } from "./region";

export interface TaskData {
    characters: CharacterData[];
    version: string;
    lastTrackerVisit: string;
    selectedCharacterIndex: number;
    mapleRegion: Region;
    editModeActive: boolean;
    infoVisible: boolean;
    imagePrefix: string;
}

export interface CharacterData {
    characterName: string;
    taskGroups: TaskGroup[];
}

export interface TaskGroup {
    title: string;
    tasks: Task[];
    allDisabled: boolean;
}

export interface Task {
    name: string;
    image: string;
    done: boolean;
    enabled: boolean;
    type: string;
    dispCon: string;
}