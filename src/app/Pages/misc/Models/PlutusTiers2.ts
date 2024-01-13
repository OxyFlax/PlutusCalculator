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

export interface EligibleSpendTier {
  name: string;
  cost: number;
  eligibleSpend: number;
}

export interface CurrentPrices {
  eurPrice: number
  gbpPrice: number;
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
