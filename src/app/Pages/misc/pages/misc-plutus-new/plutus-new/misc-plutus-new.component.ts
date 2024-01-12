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

  selectedSubscriptionTier = this.subscriptionTiers[0];
  selectedStackingTier = this.stackingTiers[0];
  selectedEligibleSpendTier = this.eligibleSpendTiers[0];

  currencySymbol: string = "€";

  cashbackRate: number = 0;
  perkCount: number = 0;
  eligibleSpend: number = 0;

  monthlyCashbackValue: number = 0;
  monthlyPerkValue: number = 0;
  totalMonthlyValue: number = 0;
  subscriptionCost: number = 0;
  redeemCost: number = 0;
  
  totalYearlyValue: number = 0;
  actualTotalYearlyValue: number = 0;



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

  showPromotions: boolean = true;
  selected: boolean = true;
  notSelected: boolean = true;


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
    this.fetchPluPrice();
    this.initialise();
  }

  ngOnDestroy() {
    this.titleService.setTitle("Random Stuff");
  }

  initialise() {
    if (localStorage.getItem("pluCurrencySymbol")) {
      this.currencySymbol = localStorage.getItem("pluCurrencySymbol");
    }

    // this.calculate();
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

  selectPromotionsClicked() {
    this.showPromotions = !this.showPromotions;
  }

  calculate() {
    this.calculateCashbackRate();
    this.calculatePerkCount();
    this.calculateEligibleSpend();

    this.calculateMonthlyCashback();
    this.calculateMonthlyPerkValue();

    this.calculateTotalMonthlyValue();
    this.calculateTotalYearlyValue();

    this.calculateSubscriptionCost();
    this.calculateRedeemCost();

    this.calculateActualTotalYearlyValue();

  }

  calculateCashbackRate() {
    if (this.selectedStackingTier.name !== "None") {
      this.cashbackRate = this.selectedStackingTier.cashbackPercentage;
      return;
    }

    if (this.selectedSubscriptionTier.name === "Standard") {
      this.cashbackRate = 0;
    } else {
      this.cashbackRate = this.selectedSubscriptionTier.cashbackPercentage
    }
  }

  calculatePerkCount() {
    this.perkCount = this.selectedSubscriptionTier.perkCount + this.selectedStackingTier.perkCount;  
  }

  calculateEligibleSpend() {
    this.eligibleSpend = this.selectedSubscriptionTier.eligibleSpend + this.selectedEligibleSpendTier.eligibleSpend;
  }

  calculateMonthlyCashback() {
    //no cashback if user is on standard subscription
    if (this.selectedSubscriptionTier.name === "Standard") { 
      this.monthlyCashbackValue = 0; 
      return; 
    }

    this.monthlyCashbackValue = this.eligibleSpend * (this.cashbackRate / 100);
  }

  calculateMonthlyPerkValue() {
    //no cashback if user is on standard subscription
    if (this.selectedSubscriptionTier.name === "Standard") { 
      this.monthlyPerkValue = 0;
      return; 
    } 
    this.monthlyPerkValue = this.perkCount * 10;
  }
  
  calculateTotalMonthlyValue() {
    this.totalMonthlyValue = this.monthlyCashbackValue + this.monthlyPerkValue;
  }

  calculateTotalYearlyValue() {
    this.totalYearlyValue = this.totalMonthlyValue * 12;
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

