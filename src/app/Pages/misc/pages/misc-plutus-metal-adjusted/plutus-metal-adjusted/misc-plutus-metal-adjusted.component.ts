import { Component, OnInit, OnDestroy } from '@angular/core';
import PlutusJson from '../../../../../../assets/Misc/PlutusTiers.json';
import { Meta, Title } from '@angular/platform-browser';
import { PlutusMetalTier, PlutusStackingTier, PlutusSubscriptionTier } from '../../../Models/PlutusTiers';

@Component({
  selector: 'app-misc-plutus-metal-adjusted',
  templateUrl: './misc-plutus-metal-adjusted.component.html',
  styleUrls: ['./misc-plutus-metal-adjusted.component.css']
})
export class MiscPlutusMetalAdjustedComponent implements OnInit, OnDestroy {
  subscriptionTiers: PlutusSubscriptionTier[] = PlutusJson.subscriptionTiers;
  stackingTiers: PlutusStackingTier[] = PlutusJson.stackingTiers;
  metalTiers: PlutusMetalTier[] = PlutusJson.metalTiers;

  perkCount: number = 0;
  eligibleSpend: number = 0;

  currencySymbol: string = "€";

  subscriptionTierSelectedIndex: number = 0;

  stackingTierSelectedIndex: number = 0;

  superChargedPerksValue: number[] = [0, 0, 0];
  superChargedPerksActualValue: number[] = [0, 0, 0];
  goldenTicketReferralsValue: number[] = [0, 0, 0];
  goldenTicketReferralsActualValue: number[] = [0, 0, 0];
  doubleRewardsVoucherValue: number[] = [0, 0, 0];
  doubleRewardsVoucherActualValue: number[] = [0, 0, 0];
  originalBenefitsValue: number[] = [0, 0, 0];

  superChargedPerksTotalCalc: boolean = true;
  superChargedPerksActualTotalCalc: boolean = false;
  goldenTicketReferralsTotalCalc: boolean = true;
  goldenTicketReferralsActualTotalCalc: boolean = false;
  doubleRewardsVoucherTotalCalc: boolean = true;
  doubleRewardsVoucherActualTotalCalc: boolean = false;

  totalValue: number[] = [0, 0, 0];
  totalActualValue: number[] = [0, 0, 0];
  totalValueMinusCost: number[] = [0, 0, 0];
  totalOriginalBenefits: number[] = [0, 0, 0];

  constructor(private titleService: Title, private metaService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("Plutus Metal Calculator");
    this.metaService.updateTag({ name: "description", content: "Custom Plutus Metal Benefit Calculator" });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "noindex, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "noindex, follow" });
    }

    this.calculate();
  }

  ngOnDestroy() {
    this.titleService.setTitle("Random Stuff");
  }

  stackingTierChange(event: any) {
    this.stackingTierSelectedIndex = event.target.selectedIndex;
    this.calculate();
  }

  subscriptionTierChange(event: any) {
    this.subscriptionTierSelectedIndex = event.target.selectedIndex;
    this.calculate();
  }

  calculate() {
    this.calculatePerkCountAndEligibleSpend();
    this.calculateSuperChargedPerks();
    this.calculateDoubleRewardsVoucher();
    this.calculateGoldenTicketReferrals();

    this.calculateTotals();
    this.calculateOriginalBenefitValue();
  }

  calculatePerkCountAndEligibleSpend() {
    this.perkCount = this.subscriptionTiers[this.subscriptionTierSelectedIndex].perkCount 
    + this.stackingTiers[this.stackingTierSelectedIndex].perkCount;
    this.eligibleSpend = this.subscriptionTiers[this.subscriptionTierSelectedIndex].spendingLimit 
    + this.stackingTiers[this.stackingTierSelectedIndex].spendingLimit;
  }

  calculateSuperChargedPerks() {
    // amount of perks times their value times the amount of months
    this.superChargedPerksValue[0] = this.perkCount * 20 * 3;
    this.superChargedPerksValue[1] = this.perkCount * 30 * 6;
    this.superChargedPerksValue[2] = this.perkCount * 50 * 12;

    
    // the same but with the original perk value subtracted
    this.superChargedPerksActualValue[0] = this.perkCount * 10 * 3;
    this.superChargedPerksActualValue[1] = this.perkCount * 20 * 6;
    this.superChargedPerksActualValue[2] = this.perkCount * 40 * 12;
  }

  calculateGoldenTicketReferrals() {
    // value times amount of tickets
    this.goldenTicketReferralsValue[0] = 50 * 3;
    this.goldenTicketReferralsValue[1] = 50 * 6;
    this.goldenTicketReferralsValue[2] = 50 * 12;

    // value times amount of tickets minus original referral bonus
    this.goldenTicketReferralsActualValue[0] = 40 * 3;
    this.goldenTicketReferralsActualValue[1] = 40 * 6;
    this.goldenTicketReferralsActualValue[2] = 40 * 12;
  }

  calculateDoubleRewardsVoucher() {
    // 100 times the amount of double reward vouchers
    // 50 times the amount for actual value
    // the max single transaction is to take spending limits into account as it can limit the reward
    var maxSingleTransactionCashback = this.eligibleSpend * (this.stackingTiers[this.stackingTierSelectedIndex].cashbackPercentage / 100);
    if (maxSingleTransactionCashback > 50) {
      this.doubleRewardsVoucherValue[0] = 100 * 3;
      this.doubleRewardsVoucherValue[1] = 100 * 6;
      this.doubleRewardsVoucherValue[2] = 100 * 12;
      this.doubleRewardsVoucherActualValue[0] = 50 * 3;
      this.doubleRewardsVoucherActualValue[1] = 50 * 6;
      this.doubleRewardsVoucherActualValue[2] = 50 * 12;
    } else {
      this.doubleRewardsVoucherValue[0] = maxSingleTransactionCashback * 2 * 3;
      this.doubleRewardsVoucherValue[1] = maxSingleTransactionCashback * 2 * 6;
      this.doubleRewardsVoucherValue[2] = maxSingleTransactionCashback * 2 * 12
      this.doubleRewardsVoucherActualValue[0] = maxSingleTransactionCashback * 3;
      this.doubleRewardsVoucherActualValue[1] = maxSingleTransactionCashback * 6;
      this.doubleRewardsVoucherActualValue[2] = maxSingleTransactionCashback * 12
    }
  }

  calculateTotals() {
    // calculate total value
    this.totalValue = [0, 0, 0];

    this.totalValue[0] += this.superChargedPerksValue[0];
    this.totalValue[1] += this.superChargedPerksValue[1];
    this.totalValue[2] += this.superChargedPerksValue[2];

    this.totalValue[0] += this.goldenTicketReferralsValue[0];
    this.totalValue[1] += this.goldenTicketReferralsValue[1];
    this.totalValue[2] += this.goldenTicketReferralsValue[2];

    this.totalValue[0] += this.doubleRewardsVoucherValue[0];
    this.totalValue[1] += this.doubleRewardsVoucherValue[1];
    this.totalValue[2] += this.doubleRewardsVoucherValue[2];

    // calculate total value minus metal card cost
    this.totalValueMinusCost[0] = this.totalValue[0] - this.metalTiers[0].cost;
    this.totalValueMinusCost[1] = this.totalValue[1] - this.metalTiers[1].cost;
    this.totalValueMinusCost[2] = this.totalValue[2] - this.metalTiers[2].cost;

    // calculate the actual total value
    this.totalActualValue = [0, 0, 0];

    this.totalActualValue[0] += this.superChargedPerksActualValue[0];
    this.totalActualValue[1] += this.superChargedPerksActualValue[1];
    this.totalActualValue[2] += this.superChargedPerksActualValue[2];

    this.totalActualValue[0] += this.goldenTicketReferralsActualValue[0];
    this.totalActualValue[1] += this.goldenTicketReferralsActualValue[1];
    this.totalActualValue[2] += this.goldenTicketReferralsActualValue[2];

    this.totalActualValue[0] += this.doubleRewardsVoucherActualValue[0];
    this.totalActualValue[1] += this.doubleRewardsVoucherActualValue[1];
    this.totalActualValue[2] += this.doubleRewardsVoucherActualValue[2];

    // calculate original benefits
    this.totalOriginalBenefits[0] = this.totalValue[0] - this.totalActualValue[0]
    this.totalOriginalBenefits[1] = this.totalValue[1] - this.totalActualValue[1]
    this.totalOriginalBenefits[2] = this.totalValue[2] - this.totalActualValue[2]
    
  }

  calculateOriginalBenefitValue() {
      //     this.totalValue[0] += this.superChargedPerksActualValue[0];
  //     this.totalValue[1] += this.superChargedPerksActualValue[1];
  //     this.totalValue[2] += this.superChargedPerksActualValue[2];

    //     this.totalValue[0] += this.goldenTicketReferralsActualValue[0];
  //     this.totalValue[1] += this.goldenTicketReferralsActualValue[1];
  //     this.totalValue[2] += this.goldenTicketReferralsActualValue[2];

    //     this.totalValue[0] += this.doubleRewardsVoucherActualValue[0];
  //     this.totalValue[1] += this.doubleRewardsVoucherActualValue[1];
  //     this.totalValue[2] += this.doubleRewardsVoucherActualValue[2];
  }

  // calculateTotal() {
  //   this.totalValue = [0, 0, 0];

  //   if (this.superChargedPerksTotalCalc) {
  //     this.totalValue[0] += this.superChargedPerksValue[0];
  //     this.totalValue[1] += this.superChargedPerksValue[1];
  //     this.totalValue[2] += this.superChargedPerksValue[2];
  //   }

  //   if (this.superChargedPerksActualTotalCalc) {
  //     this.totalValue[0] += this.superChargedPerksActualValue[0];
  //     this.totalValue[1] += this.superChargedPerksActualValue[1];
  //     this.totalValue[2] += this.superChargedPerksActualValue[2];
  //   }

  //   if (this.goldenTicketReferralsTotalCalc) {
  //     this.totalValue[0] += this.goldenTicketReferralsValue[0];
  //     this.totalValue[1] += this.goldenTicketReferralsValue[1];
  //     this.totalValue[2] += this.goldenTicketReferralsValue[2];
  //   }

  //   if (this.goldenTicketReferralsActualTotalCalc) {
  //     this.totalValue[0] += this.goldenTicketReferralsActualValue[0];
  //     this.totalValue[1] += this.goldenTicketReferralsActualValue[1];
  //     this.totalValue[2] += this.goldenTicketReferralsActualValue[2];
  //   }

  //   if (this.doubleRewardsVoucherTotalCalc) {
  //     this.totalValue[0] += this.doubleRewardsVoucherValue[0];
  //     this.totalValue[1] += this.doubleRewardsVoucherValue[1];
  //     this.totalValue[2] += this.doubleRewardsVoucherValue[2];
  //   }

  //   if (this.doubleRewardsVoucherActualTotalCalc) {
  //     this.totalValue[0] += this.doubleRewardsVoucherActualValue[0];
  //     this.totalValue[1] += this.doubleRewardsVoucherActualValue[1];
  //     this.totalValue[2] += this.doubleRewardsVoucherActualValue[2];
  //   }

  //   this.totalValueMinusCost[0] = this.totalValue[0] - this.metalTiers[0].cost;
  //   this.totalValueMinusCost[1] = this.totalValue[1] - this.metalTiers[1].cost;
  //   this.totalValueMinusCost[2] = this.totalValue[2] - this.metalTiers[2].cost;
  // }

  superChargedChanged() {
    if(this.superChargedPerksTotalCalc) {
      this.superChargedPerksActualTotalCalc = false;
    }
    this.calculate();
  }

  superChargedActualChanged() {
    if(this.superChargedPerksActualTotalCalc) {
      this.superChargedPerksTotalCalc = false;
    }
    this.calculate();
  }

  goldenTicketChanged() {
    if(this.goldenTicketReferralsTotalCalc) {
      this.goldenTicketReferralsActualTotalCalc = false;
    }
    this.calculate();
  }

  goldenTicketActualChanged() {
    if(this.goldenTicketReferralsActualTotalCalc) {
      this.goldenTicketReferralsTotalCalc = false;
    }
    this.calculate();
  }

  doubleRewardsChanged() {
    if(this.doubleRewardsVoucherTotalCalc) {
      this.doubleRewardsVoucherActualTotalCalc = false;
    }
    this.calculate();
  }

  doubleRewardsActualChanged() {
    if(this.doubleRewardsVoucherActualTotalCalc) {
      this.doubleRewardsVoucherTotalCalc = false;
    }
    this.calculate();
  }

  changeCurrency() {
    if (this.currencySymbol === "€") {
      this.currencySymbol = "£";
    } else {
      this.currencySymbol = "€";
    }
  }
}

