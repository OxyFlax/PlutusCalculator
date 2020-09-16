import { Flame } from "./flame";

export interface FlameSaveData {
    characterName: string;
    selectedClassIndex: number; // to know what class they need to be calculated for

    hat: Flame;
    top: Flame;
    belt: Flame;
    bottom: Flame;
    shoes: Flame;
    gloves: Flame;
    cape: Flame;
    shoulder: Flame;
    weapon: Flame;
    pocket: Flame;
    pendant1: Flame;
    pendant2: Flame;
    face: Flame;
    eye: Flame;
    earrings: Flame;
    extra1: Flame;
    extra2: Flame;
    extra3: Flame;
    extra4: Flame;
    extra5: Flame;
}