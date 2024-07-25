export interface PlutusSubscriptionTier {
  name: string;
  cost: number,
  eligibleSpend: number;
  cashbackPercentage: number;
  perkCount: number;
}

export interface PlutusStackingTier {
  name: string;
  pluRequired: number;
  cashbackPercentage: number;
  perkCount: number;
  
}

export interface PlutusStackingTierNew {
  name: string;
  pluRequired: number;
  cashbackPercentage: number;
  cryRate: number;
  perkCount: number;
  stackablePerkCount: number;
  freePayouts: number;
  doubleRewards: number;
  directDebitRewards: number;
  goldenTickets: number;
}

export interface EligibleSpendTier {
  name: string;
  cost: number;
  eligibleSpend: number;
}

export interface PlutusMetalTier {
  name: string;
  cost: number;
  duration: number;
  perkValue: number;
}

export interface Promos {
  id: number;
  name: string;
  date: string;
  description: string;
  termsLink: string;
  enabled: boolean;
}


export interface Coin {
  pluton: Pluton;
}

export interface Pluton {
  eur: number;
  gbp: number;
}

export interface Fiat {
  tether: Tether;
}

export interface Tether {
  eur: number;
  gbp: number;
}
