import { Component, OnInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-misc-plutus-metal',
  templateUrl: './misc-plutus-metal.component.html',
  styleUrls: ['./misc-plutus-metal.component.css']
})
export class MiscPlutusMetalComponent implements OnInit, OnDestroy {
  totalPerkCount: number = 0;

  currencySymbol: string = "€";

  subscriptionTierSelectedIndex: number = 0;
  subscriptionTiers: string[] = [
    "Starter",
    "Everyday",
    "Premium"
  ]

  stackingTierSelectedIndex: number = 0;
  stackingTiers: string[] = [
    "No Stack",
    "Researcher",
    "Explorer",
    "Adventurer",
    "Hero",
    "Veteran",
    "Legend",
    "Goat"
  ]

  metalCosts: number[] = [
    249,
    649,
    1249
  ]

  superChargedPerksValue: number[] = [0, 0, 0];
  superChargedPerksActualValue: number[] = [0, 0, 0];
  goldenTicketReferralsValue: number[] = [0, 0, 0];
  goldenTicketReferralsActualValue: number[] = [0, 0, 0];
  doubleRewardsVoucherValue: number[] = [0, 0, 0];

  superChargedPerksTotalCalc: boolean = true;
  superChargedPerksActualTotalCalc: boolean = false;
  goldenTicketReferralsTotalCalc: boolean = true;
  goldenTicketReferralsActualTotalCalc: boolean = false;
  doubleRewardsVoucherTotalCalc: boolean = true;

  totalValue: number[] = [0, 0, 0];
  totalValueMinusCost: number[] = [0, 0, 0];

  constructor(private titleService: Title, private metaService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("Misc Plutus Metal | Random Stuff");
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
    this.calculatePerkCount();
    this.calculateSuperChargedPerks();
    this.calculateDoubleRewardsVoucher();
    this.calculateGoldenTicketReferrals();

    this.calculateTotal();
  }

  calculatePerkCount() {
    var perkCount = 0;

    switch (this.subscriptionTierSelectedIndex) {
      case 1: {
        // everyday has 2 perks
        perkCount += 2;
        break;
      }
      case 2: {
        // premium has 3 perks
        perkCount += 3;
        break;
      }
    }

    switch (this.stackingTierSelectedIndex) {
      case 3: {
        // adventurer has 1 extra perk
        perkCount += 1;
        break;
      }
      case 4: {
        // hero has 4 extra perks
        perkCount += 4;
        break;
      }
      case 5: {
        // veteran has 5 extra perks
        perkCount += 5;
        break;
      }
      case 6: {
        // legend has 6 extra perks
        perkCount += 6;
        break;
      }
      case 7: {
        // goat has 8 extra perks
        perkCount += 8;
        break;
      }
    }

    this.totalPerkCount = perkCount;
  }

  calculateSuperChargedPerks() {
    // amount of perks times their value times the amount of months
    this.superChargedPerksValue[0] = this.totalPerkCount * 20 * 3;
    this.superChargedPerksValue[1] = this.totalPerkCount * 30 * 6;
    this.superChargedPerksValue[2] = this.totalPerkCount * 50 * 12;

    
    // the same but with the original perk value subtracted
    this.superChargedPerksActualValue[0] = this.totalPerkCount * 10 * 3;
    this.superChargedPerksActualValue[1] = this.totalPerkCount * 20 * 6;
    this.superChargedPerksActualValue[2] = this.totalPerkCount * 40 * 12;
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
    this.doubleRewardsVoucherValue[0] = 100 * 3;
    this.doubleRewardsVoucherValue[1] = 100 * 6;
    this.doubleRewardsVoucherValue[2] = 100 * 12;
  }

  calculateTotal() {
    this.totalValue = [0, 0, 0];

    if (this.superChargedPerksTotalCalc) {
      this.totalValue[0] += this.superChargedPerksValue[0];
      this.totalValue[1] += this.superChargedPerksValue[1];
      this.totalValue[2] += this.superChargedPerksValue[2];
    }

    if (this.superChargedPerksActualTotalCalc) {
      this.totalValue[0] += this.superChargedPerksActualValue[0];
      this.totalValue[1] += this.superChargedPerksActualValue[1];
      this.totalValue[2] += this.superChargedPerksActualValue[2];
    }

    if (this.goldenTicketReferralsTotalCalc) {
      this.totalValue[0] += this.goldenTicketReferralsValue[0];
      this.totalValue[1] += this.goldenTicketReferralsValue[1];
      this.totalValue[2] += this.goldenTicketReferralsValue[2];
    }

    if (this.goldenTicketReferralsActualTotalCalc) {
      this.totalValue[0] += this.goldenTicketReferralsActualValue[0];
      this.totalValue[1] += this.goldenTicketReferralsActualValue[1];
      this.totalValue[2] += this.goldenTicketReferralsActualValue[2];
    }

    if (this.doubleRewardsVoucherTotalCalc) {
      this.totalValue[0] += this.doubleRewardsVoucherValue[0];
      this.totalValue[1] += this.doubleRewardsVoucherValue[1];
      this.totalValue[2] += this.doubleRewardsVoucherValue[2];
    }

    this.totalValueMinusCost[0] = this.totalValue[0] - this.metalCosts[0];
    this.totalValueMinusCost[1] = this.totalValue[1] - this.metalCosts[1];
    this.totalValueMinusCost[2] = this.totalValue[2] - this.metalCosts[2];
  }

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

