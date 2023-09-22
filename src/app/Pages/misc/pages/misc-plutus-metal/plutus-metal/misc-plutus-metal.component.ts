import { Component, OnInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-misc-plutus-metal',
  templateUrl: './misc-plutus-metal.component.html',
  styleUrls: ['./misc-plutus-metal.component.css']
})
export class MiscPlutusMetalComponent implements OnInit, OnDestroy {
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
  totalPerkCount: number = 0;

  tableHeader: string[] = [
    "",
    "Champion",
    "Master",
    "Grandmaster"
  ]

  metalCosts: string [] = [
    "Cost Of The Card",
    "-249 €/£",
    "-649 €/£",
    "-1249 €/£"
  ]

  superChargedPerksValue: string[] = ["Super Charged Perks", "0 €/£", "0 €/£", "0 €/£"];
  superChargedPerksActualValue: string[] = ["Super Charged Perks Minus Default Value", "0 €/£", "0 €/£", "0 €/£"];
  goldenTicketReferralsValue: string[] = ["Golden Ticket Referral", "0 €/£", "0 €/£", "0 €/£"];
  goldenTicketReferralsActualValue: string[] = ["Golden Ticket Referral Minus Default Value", "0 €/£", "0 €/£", "0 €/£"];
  doubleRewardsVoucherValue: string[] = ["x2 Rewards Voucher", "0 €/£", "0 €/£", "0 €/£"];

  superChargedPerksTotalCalc: boolean = true;
  superChargedPerksActualTotalCalc: boolean = false;
  goldenTicketReferralsTotalCalc: boolean = true;
  goldenTicketReferralsActualTotalCalc: boolean = false;
  doubleRewardsVoucherTotalCalc: boolean = true;

  totalValue: string[] = ["Total Value", "0 €/£", "0 €/£", "0 €/£"];
  totalValueMinusCost: string[] = ["Total Value Minus Cost", "0 €/£", "0 €/£", "0 €/£"];


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
    this.calculateSuperChargedPerksValue();
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

  calculateSuperChargedPerksValue() {
    this.superChargedPerksValue = [];
    this.superChargedPerksValue.push("Super Charged Perks");
    this.superChargedPerksValue.push((this.totalPerkCount * 20 * 3).toString() + " €/£");
    this.superChargedPerksValue.push((this.totalPerkCount * 30 * 6).toString() + " €/£");
    this.superChargedPerksValue.push((this.totalPerkCount * 50 * 12).toString() + " €/£");
    
    this.superChargedPerksActualValue = [];
    this.superChargedPerksActualValue.push("Super Charged Perks Minus Original Value");
    this.superChargedPerksActualValue.push((this.totalPerkCount * 10 * 3).toString() + " €/£");
    this.superChargedPerksActualValue.push((this.totalPerkCount * 20 * 6).toString() + " €/£");
    this.superChargedPerksActualValue.push((this.totalPerkCount * 40 * 12).toString() + " €/£");
  }

  calculateGoldenTicketReferrals() {
    this.goldenTicketReferralsValue = [];
    this.goldenTicketReferralsValue.push("Golden Ticket Referral");
    this.goldenTicketReferralsValue.push((50 * 3).toString() + " €/£");
    this.goldenTicketReferralsValue.push((50 * 6).toString() + " €/£");
    this.goldenTicketReferralsValue.push((50 * 12).toString() + " €/£");
    
    this.goldenTicketReferralsActualValue = [];
    this.goldenTicketReferralsActualValue.push("Golden Ticket Referral Minus Default Value");
    this.goldenTicketReferralsActualValue.push((40 * 3).toString() + " €/£");
    this.goldenTicketReferralsActualValue.push((40 * 6).toString() + " €/£");
    this.goldenTicketReferralsActualValue.push((40 * 12).toString() + " €/£");
  }

  calculateDoubleRewardsVoucher() {
    this.doubleRewardsVoucherValue = [];
    this.doubleRewardsVoucherValue.push("x2 Rewards Voucher");
    this.doubleRewardsVoucherValue.push((100 * 3).toString() + " €/£");
    this.doubleRewardsVoucherValue.push((100 * 6).toString() + " €/£");
    this.doubleRewardsVoucherValue.push((100 * 12).toString() + " €/£");
  }

  calculateTotal() {
    var championValue = 0;
    var masterValue = 0;
    var grandmasterValue = 0;

    // yes I know this is reusing the calculations for the display which is awful but I had to do this in a super short time frame
    if (this.superChargedPerksTotalCalc) {
      championValue += this.totalPerkCount * 20 * 3;
      masterValue += this.totalPerkCount * 30 * 6;
      grandmasterValue += this.totalPerkCount * 50 * 12;
    }

    if (this.superChargedPerksActualTotalCalc) {
      championValue += this.totalPerkCount * 10 * 3;
      masterValue += this.totalPerkCount * 20 * 6;
      grandmasterValue += this.totalPerkCount * 40 * 12;
    }

    if (this.goldenTicketReferralsTotalCalc) {
      championValue += 50 * 3;
      masterValue += 50 * 6;
      grandmasterValue += 50 * 12;
    }

    if (this.goldenTicketReferralsActualTotalCalc) {
      championValue += 40 * 3;
      masterValue += 40 * 6;
      grandmasterValue += 40 * 12;
    }

    if (this.doubleRewardsVoucherTotalCalc) {
      championValue += 100 * 3;
      masterValue += 100 * 6;
      grandmasterValue += 100 * 12;
    }

    this.totalValue[1] = championValue + " €/£";
    this.totalValue[2] = masterValue + " €/£";
    this.totalValue[3] = grandmasterValue + " €/£";

    this.totalValueMinusCost[1] = (championValue - 249) + " €/£";
    this.totalValueMinusCost[2] = (masterValue - 649) + " €/£";
    this.totalValueMinusCost[3] = (grandmasterValue - 1249) + " €/£";
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
}

