import { TaskGroup } from "./trackerData";
import { FlameData } from "./flameData";
import { ArcaneSymbolData, SacredSymbolData } from "./symbolData";

export interface CharacterInfo {
    characterName: string;
    characterStorageReference: string;
}

export interface CharacterData {
    dailyTaskGroups: TaskGroup[];
    weeklyTaskGroups: TaskGroup[];
    //arcaneSymbolData: ArcaneSymbolData;
    //sacredSymbolData: SacredSymbolData;
    flameData: FlameData;
}