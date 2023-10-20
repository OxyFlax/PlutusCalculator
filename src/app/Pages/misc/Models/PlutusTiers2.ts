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