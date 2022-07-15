export interface SacredSymbol {
    level: number;
    stat: number;
    statXenon: number;
    statDemonAvenger: number;
    sacredForce: number;
    symbolExpRequired: number;
}

export interface SacredSymbolSaveData {
    cerniumLevel: number,
    cerniumExp: number,
    cerniumDailyQuest: boolean,
    burningCerniumDailyQuest: boolean,

    arcusLevel: number,
    arcusExp: number,
    arcusDailyQuest: boolean,
}