import { FlameSaveData } from "./flameSaveData";

export interface FlameData {
    // to allow users to adjust multipliers
    mainStatMultiplier: number;
    secondaryStatMultiplier: number;
    hpMpMultiplier: number;
    attMattMultiplier: number;
    allstatMultiplier: number;
    xenonAllstatMultiplier: number;
    lukDoubleSecondaryAllStatMultiplier: number;

    saveData: FlameSaveData[];
}