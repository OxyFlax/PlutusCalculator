import { TrackerInfo } from "./trackerData";
import { CharacterInfo } from "./characterData";

export interface GeneralData {
    mapleRegion: Region;

    selectedCharacterIndex: number;
    nextCharacterIndex: number;
    // TODO: this needs to be different as we need the same of the character without fetching all objects
    characters: CharacterInfo[]; //format: characterINDEXNR (to fetch their data object from local storage)

    trackerInfo: TrackerInfo;
}

export interface Region {
    resetUtcOffset: number;
    name: string;
}