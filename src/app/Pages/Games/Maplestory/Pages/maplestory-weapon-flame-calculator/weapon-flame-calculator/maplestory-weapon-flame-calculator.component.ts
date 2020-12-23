import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

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

  flameAdvantage: boolean = true;
  baseAttack: number = 128;
  attackFlame: number = 31;
  selectedLevelRangeIndex: number = 3;

  



  constructor(private titleService: Title, private metaService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("Maplestory Weapon Flame Calculator | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "Maplestory weapon flame calculator to determine the tier of an attack flame on a weapon."});
    if(!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }
  }

  calculateWeaponFlameTier() {
    var baseValues = this.flameAdvantage ? this.advantageWeaponTierMultipliers : this.normalWeaponTierMultipliers;
    
    // Find the right value.
    let flameTier = 0;
    let tierList = [];
    // To display possibilites
    baseValues.forEach((value, index) => {
      var predictedAttack = Math.ceil(((this.selectedLevelRangeIndex + 1) * value) * this.baseAttack) || 0;
      tierList.push(predictedAttack);
      // if (flameAttack == predictedAttack) { flameTier = index + 1; }
    });
    
    console.log(tierList);

    // Flame advantaged starts at tier 3.
    // if (flameAdvantaged && flameTier != 0) { flameTier += 2; }
    
    return {
      flameTier: flameTier,
      tierList: tierList,
    }
  }

  levelRangeChange(event: any) {
    this.selectedLevelRangeIndex = event.target.selectedIndex;
    // this.resetUtcOffset = this.regions[event.target.selectedIndex].resetUtcOffset;
    console.log(this.selectedLevelRangeIndex);
    //localStorage.setItem("mapleRegion", JSON.stringify(this.selectedLevelRange));
  }


  regionChange(event: any) {
    // this.selectedRegionIndex = event.target.selectedIndex;
    // this.resetUtcOffset = this.regions[event.target.selectedIndex].resetUtcOffset;
    // localStorage.setItem("mapleRegion", JSON.stringify(this.selectedRegionIndex));

    // // re do the checks for previous day data & setup the timers for the new resetUtcOffset
    // this.initialise();
  }
}
