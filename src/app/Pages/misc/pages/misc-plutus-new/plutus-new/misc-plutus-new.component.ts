import { Component, OnInit, OnDestroy } from '@angular/core';
import PlutusJson from '../../../../../../assets/Misc/PlutusTiers2.json';
import { Meta, Title } from '@angular/platform-browser';
import { PlutusSubscriptionTier, PlutusStackingTier, EligibleSpendTier, CurrentPrices, Coin, Pluton } from '../../../Models/PlutusTiers2';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-misc-plutus-new',
  templateUrl: './misc-plutus-new.component.html',
  styleUrls: ['./misc-plutus-new.component.css']
})
export class MiscPlutusNewComponent implements OnInit, OnDestroy {
  url: string = 'https://api.coingecko.com/api/v3/simple/price?ids=pluton&vs_currencies=eur%2Cgbp';
  pluPrice: Pluton = {
    eur: 0,
    gbp: 0
  };

  subscriptionTiers: PlutusSubscriptionTier[] = PlutusJson.subscriptionTiers;
  stackingTiers: PlutusStackingTier[] = PlutusJson.stackingTiers;
  eligibleSpendTiers: EligibleSpendTier[] = PlutusJson.eligibleSpendTiers;
  currentPrices: CurrentPrices = {eurPrice: 0, gbpPrice: 0};

  currencySymbol: string = "€";

  subscriptionTierSelectedIndex: number = 0;
  stackingTierSelectedIndex: number = 0;
  eligibleSpendTierSelectedIndex: number = 0;

  cashbackRate: number = 0;
  eligibleSpend: number = 0;
  monthlyCashbackValue: number = 0;

  perkCount: number = 0;
  monthlyPerkValue: number = 0;

  totalMonthlyValue: number = 0;
  totalYearlyValue: number = 0;
  actualTotalYearlyValue: number = 0;

  redeemCost: number = 0;


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

    // warning this fetch is not waited on, so if used for calculations, run the calculation again in this function.
    //this.fetchPluPrice();
    this.initialise();
  }

  ngOnDestroy() {
    this.titleService.setTitle("Random Stuff");
  }

  initialise() {
    if (localStorage.getItem("pluCurrencySymbol")) {
      this.currencySymbol = localStorage.getItem("pluCurrencySymbol");
    }

    this.calculate();
  }

  fetchPluPrice() {
    const apiUrl = this.url; // Replace with your API URL
  
    this.http.get<Coin>(apiUrl).subscribe(data => {
      // The JSON response is now converted into a coin object 
      const plutonData: Coin = data;
      
      // console.log(plutonData.pluton.eur);
      // console.log(plutonData.pluton.gbp);

      // add the values into the pluPrice object
      this.pluPrice = plutonData.pluton;
    });
  }

  getPrices(): Observable<Pluton> {
    return this.http.get<Pluton>(this.url);
  }

  stackingTierChange(event: any) {
    this.stackingTierSelectedIndex = event.target.selectedIndex;
    this.calculate();
  }

  subscriptionTierChange(event: any) {
    this.subscriptionTierSelectedIndex = event.target.selectedIndex;
    this.calculate();
  }

  eligibleSpendTierChange(event: any) {
    this.eligibleSpendTierSelectedIndex = event.target.selectedIndex;
    this.calculate();
  }

  calculate() {
    this.calculateCashbackRate();
    this.calculateEligibleSpend();
    this.calculateMonthlyCashback();

    this.calculatePerkCount();
    this.calculateMonthlyPerkValue();

    this.calculateTotalMonthlyValue();
    this.calculateTotalYearlyValue();
    this.calculateActualTotalYearlyValue();

    this.calculateRedeemCost();
  }

  calculateCashbackRate() {
    // if user has no stack and no subscription the cashback is 0
    if(this.subscriptionTierSelectedIndex == 0 && this.stackingTierSelectedIndex == 0) {
      this.cashbackRate = 0;
      return;
    } 

    // if user is on a stacking tier this will be their cashback %
    if (this.stackingTierSelectedIndex != 0) {
      this.cashbackRate = this.stackingTiers[this.stackingTierSelectedIndex].cashbackPercentage;
    } else {
      this.cashbackRate = this.subscriptionTiers[this.subscriptionTierSelectedIndex].cashbackPercentage;
    }
  }

  calculateEligibleSpend() {
    // if eligible spend stacks
    this.eligibleSpend = this.subscriptionTiers[this.subscriptionTierSelectedIndex].eligibleSpend + this.eligibleSpendTiers[this.eligibleSpendTierSelectedIndex].eligibleSpend;
  }

  calculateMonthlyCashback() {
    if (this.subscriptionTierSelectedIndex == 0) { return; } //no cashback if user is on standard subscription
    this.monthlyCashbackValue = this.eligibleSpend * (this.cashbackRate / 100);
  }

  calculatePerkCount() {
    this.perkCount = this.subscriptionTiers[this.subscriptionTierSelectedIndex].perkCount + this.stackingTiers[this.stackingTierSelectedIndex].perkCount;
  }

  calculateMonthlyPerkValue() {
    if (this.subscriptionTierSelectedIndex == 0) { return; } //no cashback if user is on standard subscription
    this.monthlyPerkValue = this.perkCount * 10;
  }
  
  calculateTotalMonthlyValue() {
    this.totalMonthlyValue = this.monthlyCashbackValue + this.monthlyPerkValue;
  }

  calculateTotalYearlyValue() {
    this.totalYearlyValue = this.totalMonthlyValue * 12;
  }

  calculateActualTotalYearlyValue() {
    this.actualTotalYearlyValue = this.totalYearlyValue - (this.subscriptionTiers[this.subscriptionTierSelectedIndex].cost * 12);
  }

  calculateRedeemCost() {
    if (this.currencySymbol === "€") {
      this.redeemCost = this.eligibleSpendTiers[this.eligibleSpendTierSelectedIndex].cost * this.pluPrice.eur;
    } else {
      this.redeemCost = this.eligibleSpendTiers[this.eligibleSpendTierSelectedIndex].cost * this.pluPrice.gbp;
    }
    console.log(this.redeemCost);
  }

  changeCurrency() {
    if (this.currencySymbol === "€") {
      this.currencySymbol = "£";
    } else {
      this.currencySymbol = "€";
    }
    localStorage.setItem("pluCurrencySymbol", this.currencySymbol);
    this.calculateRedeemCost();
  }
}

