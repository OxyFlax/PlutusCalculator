import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { WeaponFlameData } from '../../../Models/flameWeapon';

@Component({
  selector: 'app-maplestory-weapon-flame-calculator',
  templateUrl: './maplestory-weapon-flame-calculator.component.html',
  styleUrls: ['./maplestory-weapon-flame-calculator.component.css']
})
export class MaplestoryWeaponFlameCalculatorComponent implements OnInit {
  normalWeaponTierMultipliers: number[] = [
    0.01,
    0.022,
    0.03626,
    0.05325,
    0.073,
    0.088,
    0.1025,
  ]

  advantageWeaponTierMultipliers: number[] = [
    0.03,
    0.044,
    0.0605,
    0.0799,
    0.1025,
  ]

  itemLevelRanges: string[] = [
    "0-39",
    "40-79",
    "80-119",
    "120-159",
    "160-199",
    "200-239",
    "240-275"
  ]

  weaponFlameData: WeaponFlameData;

  calculatedTier: number = 0;
  tableOutput: number[] = new Array(7);

  constructor(private titleService: Title, private metaService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("Maplestory Weapon Flame Calculator | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "Maplestory weapon flame calculator to determine the tier of an attack flame on a weapon." });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }

    this.initialise();
  }

  initialise() {
    if (localStorage.getItem("weaponFlameData")) {
      this.weaponFlameData = JSON.parse(localStorage.getItem("weaponFlameData"));
      this.calculateWeaponFlameTier();
    } else {
      // initiate a dataset
      var newWeaponFlameData: WeaponFlameData = {
        flameAdvantage: false,
        baseAttack: null,
        flameAttack: null,
        selectedItemLevelRangeIndex: 0  
      }
      this.weaponFlameData = newWeaponFlameData;
    }
  }

  calculateWeaponFlameTier() {
    var multiplierValues = this.weaponFlameData.flameAdvantage ? this.advantageWeaponTierMultipliers : this.normalWeaponTierMultipliers;

    // reset the values for calculations
    // items with flame advantage start at tier 3 so we skip the first 2 tiers and add 2 empty values;
    this.tableOutput = this.weaponFlameData.flameAdvantage ? [null, null] : [];
    this.calculatedTier = 0;
    // calculate all possibilities for the given base attack
    multiplierValues.forEach((value, index) => {
      var predictedAttack = Math.ceil(((this.weaponFlameData.selectedItemLevelRangeIndex + 1) * value) * this.weaponFlameData.baseAttack) || 0;
      this.tableOutput.push(predictedAttack);

      if (this.weaponFlameData.flameAttack == predictedAttack && predictedAttack != 0) { 
        this.calculatedTier += index + 1; 

        // if the flametier has an advantage it starts at 3 so we add 2 to the calculated tier;
        this.calculatedTier = this.weaponFlameData.flameAdvantage ? this.calculatedTier + 2 : this.calculatedTier;
      }
    });
  }

  itemLevelRangeChange(event: any) {
    this.weaponFlameData.selectedItemLevelRangeIndex = event.target.selectedIndex;
    this.changeHandler();
  }

  changeHandler() {
    this.calculateWeaponFlameTier();
    localStorage.setItem("weaponFlameData", JSON.stringify(this.weaponFlameData));
  }
}
