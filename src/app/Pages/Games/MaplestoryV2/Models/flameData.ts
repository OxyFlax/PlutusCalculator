export interface FlameData {
    selectedClassIndex: number; // to know what class they need to be calculated for

    // to allow users to adjust multipliers
    mainStatMultiplier: number;
    secondaryStatMultiplier: number;
    hpMpMultiplier: number;
    attMattMultiplier: number;
    allstatMultiplier: number;
    xenonAllstatMultiplier: number;
    lukDoubleSecondaryAllStatMultiplier: number;

    flameValues: FlameValues;
}

export interface FlameValues {
    hat: Flame;
    top: Flame;
    belt: Flame;
    bottom: Flame;
    shoes: Flame;
    gloves: Flame;
    cape: Flame;
    shoulder: Flame;
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

export interface Flame {
    str: number;
    dex: number;
    luk: number;
    int: number;
    hp: number;
    mp: number;
    att: number;
    matt: number;
    allstat: number;
}