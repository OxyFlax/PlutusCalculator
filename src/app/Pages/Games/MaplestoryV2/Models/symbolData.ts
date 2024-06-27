export interface Symbol {
    level: number;
    stat: number;
    statXenon: number;
    statDemonAvenger: number;
    force: number;
    symbolExpRequired: number;
}

export interface ArcaneSymbolData {
    vjLevel: number,
    vjExp: number,
    vjDailyQuest: boolean,
    vjReverseCity: boolean,
    vjErdaSpectrum: boolean,
  
    chuchuLevel: number,
    chuchuExp: number,
    chuchuDailyQuest: boolean,
    chuchuYumYumIsland: boolean,
    chuchuHungryMuto: boolean,
  
    lachLevel: number,
    lachExp: number,
    lachDailyQuest: boolean,
    lachMidnightChaser: boolean,
  
    arcanaLevel: number,
    arcanaExp: number,
    arcanaDailyQuest: boolean,
    arcanaSpiritSaviour: boolean,
  
    morassLevel: number,
    morassExp: number,
    morassDailyQuest: boolean,
    moreassRanheimDefense: boolean,
  
    esferaLevel: number,
    esferaExp: number,
    esferaDailyQuest: boolean,
    esferaGuardian: boolean
}

export interface SacredSymbolData {
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