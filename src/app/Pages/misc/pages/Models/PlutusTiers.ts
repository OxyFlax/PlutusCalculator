export interface PlutusSubscriptionTier {
  name: string;
  spendingLimit: number;
  perkCount: number;
}

export interface PlutusStackingTier {
  name: string;
  cashbackPercentage: number;
  spendingLimit: number;
  perkCount: number;
  
}

export interface PlutusMetalTier {
  name: string;
  cost: number;
}