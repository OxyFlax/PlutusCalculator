import { Component, OnInit, OnDestroy } from '@angular/core';
import PlutusJson from '../../../../../../assets/Misc/PlutusTiers.json';
import { Meta, Title } from '@angular/platform-browser';
import { PlutusSubscriptionTier, PlutusStackingTier, PlutusMetalTier, Fiat, Tether } from '../../../Models/PlutusTiers';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-misc-plutus-metal',
  templateUrl: './misc-plutus-metal.component.html',
  styleUrls: ['./misc-plutus-metal.component.css']
})
export class MiscPlutusMetalComponent implements OnInit, OnDestroy {
  url: string = 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=eur%2Cgbp';
  tetherPrice: Tether = {
    eur: 0.921792,
    gbp: 0.786658
  };


  subscriptionTiers: PlutusSubscriptionTier[] = PlutusJson.subscriptionTiers;
  stackingTiers: PlutusStackingTier[] = PlutusJson.stackingTiers;
  metalTiers: PlutusMetalTier[] = PlutusJson.metalTiers;

  selectedSubscriptionTier = this.subscriptionTiers[0];
  selectedStackingTier = this.stackingTiers[0];
  selectedMetalTier = this.metalTiers[0];

  currencySymbol: string = "€";
  perkCount: number = 0;

  superChargedPerksValue: number = 0;
  superChargedPerksActualValue: number = 0;
  goldenTicketReferralsValue: number = 0;
  goldenTicketReferralsActualValue: number = 0;
  doubleRewardsVoucherValue: number = 0;

  combinedValue: number = 0;
  gainedValue: number = 0;
  totalValue: number = 0;

  constructor(private titleService: Title, private metaService: Meta, private http: HttpClient) {
  }

  ngOnInit() {
    this.titleService.setTitle("Plutus Metal Calculator");
    this.metaService.updateTag({ name: "description", content: "Custom Plutus Metal Benefit Calculator" });
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
    // fetching tether price as it's the easiest way to get the currency conversion
    this.fetchTetherPrice();
    
    // is technically ran inside the fetch function but if it fails this will default it to the base values which are the fx rates on 25/01/2024
    this.calculate();
  }

  fetchTetherPrice() {
    const apiUrl = this.url; // Replace with your API URL
  
    this.http.get<Fiat>(apiUrl).subscribe(data => {
      // The JSON response is now converted into a coin object 
      const usdData: Fiat = data;
      
      // add the values into the pluPrice object
      this.tetherPrice = usdData.tether;

      // run the calculate in here to refresh the golden ticket price and totals
      this.calculate();
    });
  }

  stackingTierChange(event: any) {
    this.calculate();
  }

  subscriptionTierChange(event: any) {
    this.calculate();
  }

  metalTierChange(event: any) {
    this.calculate();
  }

  calculate() {
    this.calculatePerkCount();

    this.calculateSuperChargedPerks();
    this.calculateDoubleRewardsVoucher();
    this.calculateGoldenTicketReferrals();

    this.calculateTotals();
  }

  calculatePerkCount() {
    this.perkCount = this.selectedSubscriptionTier.perkCount 
    + this.selectedStackingTier.perkCount;
  }

  calculateSuperChargedPerks() {
    // no rewards on the free subscription
    if (this.selectedSubscriptionTier != this.subscriptionTiers[0]) {
      // amount of perks times their value times the amount of months
      this.superChargedPerksValue = this.perkCount * this.selectedMetalTier.perkValue * this.selectedMetalTier.duration;
    
      // the same but with the original perk value subtracted
      this.superChargedPerksActualValue = this.perkCount * (this.selectedMetalTier.perkValue - 10) * this.selectedMetalTier.duration;
    } else {
      this.superChargedPerksValue = 0;
      this.superChargedPerksActualValue = 0;
    }
  }

  calculateGoldenTicketReferrals() {
    if (this.currencySymbol === "€") {
      this.goldenTicketReferralsValue = this.selectedMetalTier.duration * 50 * this.tetherPrice.eur;
      this.goldenTicketReferralsActualValue = this.selectedMetalTier.duration * 40 * this.tetherPrice.eur;
    } else {
      this.goldenTicketReferralsValue = this.selectedMetalTier.duration * 50 * this.tetherPrice.gbp;
      this.goldenTicketReferralsActualValue = this.selectedMetalTier.duration * 40 * this.tetherPrice.gbp;
    }
  }

  calculateDoubleRewardsVoucher() {
    // no rewards on the free subscription
    if (this.selectedSubscriptionTier != this.subscriptionTiers[0]) {
      this.doubleRewardsVoucherValue = this.selectedMetalTier.duration * 50;
    } else {
      this.doubleRewardsVoucherValue = 0;
    }
  }

  calculateTotals() {
    // set values to 0
    this.combinedValue = 0;
    this.gainedValue = 0;
    this.totalValue = 0;

    // calculate combined value of all three benefits
    this.combinedValue += this.superChargedPerksValue;
    this.combinedValue += this.goldenTicketReferralsValue;
    this.combinedValue += this.doubleRewardsVoucherValue;

    // calculate combined value of all three benefits minus their base value
    this.gainedValue += this.superChargedPerksActualValue + this.goldenTicketReferralsActualValue + this.doubleRewardsVoucherValue;

    // calculate total value minus base value and card cost
    this.totalValue = this.gainedValue - this.selectedMetalTier.cost;
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

