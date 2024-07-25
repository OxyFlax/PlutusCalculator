import { Component, OnInit, OnDestroy } from '@angular/core';
import PlutusJson from '../../../../../../assets/Misc/PlutusTiers.json';
import PlutusWpJson from '../../../../../../assets/Misc/PlutusTiersWP.json';
import PlutusPromos from '../../../../../../assets/Misc/PlutusPromos.json';
import { Meta, Title } from '@angular/platform-browser';
import { PlutusSubscriptionTier, PlutusStackingTierNew, EligibleSpendTier, Coin, Pluton, Promos, Tether, Fiat } from '../../../Models/PlutusTiers';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-misc-plutus-new',
  templateUrl: './misc-plutus-new.component.html',
  styleUrls: ['./misc-plutus-new.component.css']
})
export class MiscPlutusNewComponent implements OnInit, OnDestroy {
  url: string = 'https://api.coingecko.com/api/v3/simple/price?ids=pluton&vs_currencies=eur%2Cgbp';
  url2: string = 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=eur%2Cgbp';
  pluPrice: Pluton = {
    eur: 0,
    gbp: 0
  };

  tetherPrice: Tether = {
    eur: 0.921946,
    gbp: 0.776655
  };

  subscriptionTiers: PlutusSubscriptionTier[] = PlutusJson.subscriptionTiers;
  subscriptionTiersDefault: EligibleSpendTier[] = JSON.parse(JSON.stringify(PlutusJson.subscriptionTiers)); // for resetting annual payment changes
  stackingTiers: PlutusStackingTierNew[] = PlutusWpJson.stackingTiers;
  eligibleSpendTiers: EligibleSpendTier[] = PlutusJson.eligibleSpendTiers;
  eligibleSpendTiersDefault: EligibleSpendTier[] = JSON.parse(JSON.stringify(PlutusJson.eligibleSpendTiers)); // for resetting promo changes
  promos: Promos[] = PlutusPromos.promos;

  selectedSubscriptionTier = this.subscriptionTiers[0];
  selectedStackingTier = this.stackingTiers[0];
  selectedEligibleSpendTier = this.eligibleSpendTiers[0];
  selectedStackingTierIndex = 0;

  heldPluCount: number;
  averageMonthlySpend: number;
  currencySymbol: string = "€";
  showSubRequiredMessage: boolean = false;
  showPromotions: boolean = false;

  cashbackRate: number = 0;
  perkCount: number = 0;
  eligibleSpend: number = 0;

  monthlyCashbackValue: number = 0;
  monthlyPerkValue: number = 0;
  monthlyCryValue: number = 0;
  totalMonthlyValue: number = 0;
  subscriptionCost: number = 0;
  redeemCost: number = 0;
  
  totalYearlyValue: number = 0;
  actualTotalYearlyValue: number = 0;

  doubleRewardsVoucherValue: number = 0;
  goldenTicketReferralsValue: number = 0;
  freePayoutValue: number = 0;

  totalValue: number[] = [0, 0, 0];
  totalActualValue: number[] = [0, 0, 0];
  totalValueMinusCost: number[] = [0, 0, 0];
  totalOriginalBenefits: number[] = [0, 0, 0];

  constructor(private titleService: Title, private metaService: Meta, private http: HttpClient) {
  }

  ngOnInit() {
    this.titleService.setTitle("Plutus Subscriptions & Reward Levels");
    this.metaService.updateTag({ name: "description", content: "Community calculator for Plutus Subscriptions & Reward Levels" });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "noindex, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "noindex, follow" });
    }

    this.initialise();
  }

  ngOnDestroy() {
    this.titleService.setTitle("Random Stuff");
  }

  initialise() {
    if (localStorage.getItem("pluCurrencySymbol")) {
      this.currencySymbol = localStorage.getItem("pluCurrencySymbol");
    }

    // warning this fetch is not waited on, so if used for calculations, run the calculation again in this function.
    this.fetchTetherPrice();
    this.fetchPluPrice();

    //this also calls the calculate function
    this.applyPromos();
  }

  fetchTetherPrice() {
    const apiUrl = this.url2; // Replace with your API URL
  
    this.http.get<Fiat>(apiUrl).subscribe(data => {
      // The JSON response is now converted into a coin object 
      const usdData: Fiat = data;

      // add the values into the pluPrice object
      this.tetherPrice = usdData.tether;

      // run the calculate in here to refresh the golden ticket price and totals
      this.calculate();
    });
  }

  fetchPluPrice() {
    const apiUrl = this.url; // Replace with your API URL
  
    this.http.get<Coin>(apiUrl).subscribe(data => {
      // The JSON response is now converted into a coin object 
      const plutonData: Coin = data;

      // add the values into the pluPrice object
      this.pluPrice = plutonData.pluton;
    });
    this.calculateRedeemCost();
  }

  getPrices(): Observable<Pluton> {
    return this.http.get<Pluton>(this.url);
  }

  subscriptionTierChange(event: any) {
    this.calculate();
  }

  stackingTierChange(event: any) {
    this.calculate();
  }

  eligibleSpendTierChange(event: any) {
    this.calculate();
  }

  heldPluChange($event: any) {
    if(this.heldPluCount < 0) {
      this.heldPluCount = undefined;
    }

    this.calculate();
  }

  averageSpendChange($event: any) {
    if(this.averageMonthlySpend < 0) {
      this.averageMonthlySpend = undefined;
    }

    //always run calculate incase the field is cleared
    this.calculate();
  }

  togglePromoVisiblity() {
    this.showPromotions = !this.showPromotions;
  }
  
  togglePromo(index: number) {
    this.promos[index].enabled = !this.promos[index].enabled;

    // else if list to automatically apply the best rewardscap based on the selected promos
    if(this.promos[3].enabled || this.promos[4].enabled) {
      this.selectedEligibleSpendTier = this.eligibleSpendTiers[4];
    } else if (this.promos[2].enabled) {
      this.selectedEligibleSpendTier = this.eligibleSpendTiers[3];
      } else if (this.promos[1].enabled) {
        this.selectedEligibleSpendTier = this.eligibleSpendTiers[2];
        } else if (this.promos[5].enabled) {
          this.selectedEligibleSpendTier = this.eligibleSpendTiers[1];
          }

    this.applyPromos();
  }

  applyPromos() {
    //reset the eligiblespendtier data as this is constantly being manipulated as a hardcoded promo list requires too many variations.
    //for some reason rereading the JSON file does not work, and resetting to a by value instead of reference breaks the code.
    //instead iterating over a second unmodified array to copy the default values
    for (let i = 0; i < this.eligibleSpendTiers.length; i++) {
      this.eligibleSpendTiers[i].cost = this.eligibleSpendTiersDefault[i].cost;
    }
    //reset subscriptiontier costs as they are also manipulated since the yearly susbcription payments became a thing.
    for (let i = 0; i < this.subscriptionTiers.length; i++) {
      this.subscriptionTiers[i].cost = this.subscriptionTiersDefault[i].cost;
    }

    // This is not the cleanest and reusable way of working but it's the easiest as not all promos have the same logic to apply.
    // yearly subscription payments
    if(this.promos[0].enabled) {
      for (let i = 0; i < this.subscriptionTiers.length; i++) {
        if (this.subscriptionTiers[i].cost != 0) {
          this.subscriptionTiers[i].cost = this.subscriptionTiers[i].cost * 0.83333;
        }  
      }
    }

    // 2k promo for new stack upgrades
    if(this.promos[1].enabled) {
      if(this.eligibleSpendTiers.findIndex(el => el.name == "2000") > 0) {
        this.eligibleSpendTiers[this.eligibleSpendTiers.findIndex(el => el.name == "2000")].cost = 0;
      }
    }
    
    // 5k metal promo
    if(this.promos[2].enabled) {
      if(this.eligibleSpendTiers.findIndex(el => el.name == "5000") > 0) {
        this.eligibleSpendTiers[this.eligibleSpendTiers.findIndex(el => el.name == "5000")].cost = 0;
      }
    }
    
    // 10k promo 2
    if(this.promos[3].enabled) {
      if(this.eligibleSpendTiers.findIndex(el => el.name == "10000") > 0) {
        this.eligibleSpendTiers[this.eligibleSpendTiers.findIndex(el => el.name == "10000")].cost = 0;
      }
    }

    // 10k promo 1
    if(this.promos[4].enabled) {
      if(this.eligibleSpendTiers.findIndex(el => el.name == "10000") > 0) {
        this.eligibleSpendTiers[this.eligibleSpendTiers.findIndex(el => el.name == "10000")].cost = 0;
      }
    }

    // 1k promo
    if(this.promos[5].enabled) {
      if(this.eligibleSpendTiers.findIndex(el => el.name == "1000") > 0) {
        this.eligibleSpendTiers[this.eligibleSpendTiers.findIndex(el => el.name == "1000")].cost = 0;
      }
    }

    // 50% discount promo
    if(this.promos[6].enabled) {
      for (let i = 0; i < this.eligibleSpendTiers.length; i++) {
        if (this.eligibleSpendTiers[i].cost != 0) {
          this.eligibleSpendTiers[i].cost = this.eligibleSpendTiers[i].cost / 2;
        }  
      }
    }

    this.calculate();
  }
  

  calculate() {
    this.calculateTier();
    this.calculateCashbackRate();
    this.calculatePerkCount();
    this.calculateEligibleSpend();

    this.calculateMonthlyCashback(); //TODO funky noob stuffs
    this.calculateMonthlyPerkValue();
    this.calculateDoubleRewardsVoucher();
    this.calculateGoldenTicketValue();
    this.calculateMonthlyCryValue();
    this.calculateFreePayoutValue();

    this.calculateTotalMonthlyValue();
    this.calculateTotalYearlyValue();

    this.calculateSubscriptionCost();
    this.calculateRedeemCost();

    this.calculateActualTotalYearlyValue();
 
    // check if the warning about needing to be on standard sub needs to be displayed;
    if (this.selectedSubscriptionTier == this.subscriptionTiers[0] && (this.selectedStackingTier != this.stackingTiers[0] || this.selectedEligibleSpendTier != this.eligibleSpendTiers[0])) {
      this.showSubRequiredMessage = true;
    } else {
      this.showSubRequiredMessage = false;
    }
  }

  calculateTier() {
    if (this.heldPluCount == null) {
      this.selectedStackingTier = this.stackingTiers[0];
    } else if (this.heldPluCount >= 50000) {
      this.selectedStackingTier = this.stackingTiers[this.stackingTiers.length - 1];
      this.selectedStackingTierIndex = this.stackingTiers.length - 1;
    } else {
        for (let i = 0; i < this.stackingTiers.length; i++) {
          if (this.stackingTiers[i].pluRequired > this.heldPluCount) {
            this.selectedStackingTier = this.stackingTiers[i - 1];
            this.selectedStackingTierIndex = i - 1;
            break;
          }
        }
    }
  }

  calculateCashbackRate() {
    if (this.selectedStackingTier.name !== "None") {
      if (this.selectedStackingTier.cashbackPercentage === this.stackingTiers[this.stackingTiers.length - 1].cashbackPercentage || this.stackingTiers[this.selectedStackingTierIndex + 1].cashbackPercentage < 4) {
        this.cashbackRate = this.selectedStackingTier.cashbackPercentage;
      } else {
        var pluToNextTier = this.stackingTiers[this.selectedStackingTierIndex + 1].pluRequired - this.stackingTiers[this.selectedStackingTierIndex].pluRequired;
        var extraPlu = this.heldPluCount - this.selectedStackingTier.pluRequired;
        var incrementalPercentage = Math.floor(extraPlu / pluToNextTier * 10) / 10
        this.cashbackRate = this.selectedStackingTier.cashbackPercentage + incrementalPercentage;
      }
      return;
    }

    if (this.selectedSubscriptionTier.name === "Standard Account") {
      this.cashbackRate = 0;
    } else {
      this.cashbackRate = this.selectedSubscriptionTier.cashbackPercentage;
    }
  }

  calculatePerkCount() {
    this.perkCount = this.selectedSubscriptionTier.perkCount + this.selectedStackingTier.perkCount;  
  }

  calculateEligibleSpend() {
    if (this.heldPluCount === null || isNaN(this.heldPluCount)) {
      this.eligibleSpend = this.selectedSubscriptionTier.eligibleSpend + this.selectedEligibleSpendTier.eligibleSpend;
    } else {
      this.eligibleSpend = this.selectedSubscriptionTier.eligibleSpend + this.selectedEligibleSpendTier.eligibleSpend + this.heldPluCount;
    }
  }

  calculateMonthlyCashback() {
    //no cashback if user is on standard subscription
    if (this.selectedSubscriptionTier.name === "Standard Account") { 
      this.monthlyCashbackValue = 0; 
      return; 
    }

    //if the average monthly spend is zero or higher than the max eligible spend, then calculate using the max eligible spend
    if(this.averageMonthlySpend > this.eligibleSpend || this.averageMonthlySpend == null || this.averageMonthlySpend == 0) {
      this.monthlyCashbackValue = this.eligibleSpend * (this.cashbackRate / 100);
    } else {
        this.monthlyCashbackValue = this.averageMonthlySpend * (this.cashbackRate / 100);
    }

  }

  calculateMonthlyPerkValue() {
    //no cashback if user is on standard subscription
    if (this.selectedSubscriptionTier.name === "Standard Account") { 
      this.monthlyPerkValue = 0;
      return; 
    } 
    this.monthlyPerkValue = this.perkCount * 10;
  }

  calculateDoubleRewardsVoucher() {
    // no cashback if user is on standard subscription
    if (this.selectedSubscriptionTier.name === "Standard Account") { 
      this.doubleRewardsVoucherValue = 0; 
      return; 
    }

    if(this.monthlyCashbackValue > (this.selectedStackingTier.doubleRewards * 20)) {
      this.doubleRewardsVoucherValue = this.selectedStackingTier.doubleRewards * 20;
    } else {
      this.doubleRewardsVoucherValue = this.monthlyCashbackValue;
    }
  }

  calculateGoldenTicketValue() {
    if (this.currencySymbol === "€") {
      this.goldenTicketReferralsValue = this.selectedStackingTier.goldenTickets * 20 * this.tetherPrice.eur;
    } else {
      this.goldenTicketReferralsValue = this.selectedStackingTier.goldenTickets * 20 * this.tetherPrice.gbp;
    }
  }

  calculateFreePayoutValue() {
    if (this.selectedStackingTier.freePayouts >= 1 && this.selectedSubscriptionTier.name !== "Standard Account") {
      this.freePayoutValue = 15;
    } else {
      this.freePayoutValue = 0;
    }
  }

  calculateMonthlyCryValue() {
    // to prevent it from calculating NaN check if heldPluCount is not null
    var intermediateMonthlyValue = this.monthlyCashbackValue + this.monthlyPerkValue + this.doubleRewardsVoucherValue + this.goldenTicketReferralsValue;
    var cryRate = 0;
    if (this.cashbackRate == 3) {
      cryRate = this.selectedStackingTier.cryRate / 100;
    } else {
      cryRate = this.cashbackRate / 100;
    }

    if(this.heldPluCount != null) {
      this.monthlyCryValue = ((this.heldPluCount / 12) + intermediateMonthlyValue) * cryRate * 2;
    } else {
      this.monthlyCryValue = intermediateMonthlyValue * cryRate * 2;
    }
   }
  
  calculateTotalMonthlyValue() {
    this.totalMonthlyValue = this.monthlyCashbackValue + this.monthlyPerkValue + this.doubleRewardsVoucherValue + this.goldenTicketReferralsValue + this.freePayoutValue + this.monthlyCryValue;
  }

  calculateTotalYearlyValue() {
    this.totalYearlyValue = (this.totalMonthlyValue * 12);
  }

  calculateSubscriptionCost() {
    this.subscriptionCost = this.selectedSubscriptionTier.cost * 12;
  }

  calculateRedeemCost() {
    if (this.currencySymbol === "€") {
      this.redeemCost = this.selectedEligibleSpendTier.cost * this.pluPrice.eur;
    } else {
      this.redeemCost = this.selectedEligibleSpendTier.cost * this.pluPrice.gbp;
    }
  }

  calculateActualTotalYearlyValue() {
    this.actualTotalYearlyValue = this.totalYearlyValue - this.subscriptionCost - this.redeemCost;
  }

  changeCurrency() {
    if (this.currencySymbol === "€") {
      this.currencySymbol = "£";
    } else {
      this.currencySymbol = "€";
    }
    localStorage.setItem("pluCurrencySymbol", this.currencySymbol);
    this.calculate();
  }
}

