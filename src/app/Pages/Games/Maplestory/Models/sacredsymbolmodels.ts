export interface SacredSymbol {
    level: number;
    stat: number;
    statXenon: number;
    statDemonAvenger: number;
    sacredForce: number;
    symbolExpRequired: number;
}

export interface SacredSymbolSaveData {
    cerniumLevel: number;
    cerniumExp: number;
    cerniumDailyQuest: boolean;

    arcusLevel: number;
    arcusExp: number;
    arcusDailyQuest: boolean;

    odiumLevel: number;
    odiumExp: number;
    odiumDailyQuest: boolean;
    
    shangrilaLevel: number;
    shangrilaExp: number;
    shangrilaDailyQuest: boolean;
    
    arteriaLevel: number;
    arteriaExp: number;
    arteriaDailyQuest: boolean;
    
    carcionLevel: number;
    carcionExp: number;
    carcionDailyQuest: boolean;
}