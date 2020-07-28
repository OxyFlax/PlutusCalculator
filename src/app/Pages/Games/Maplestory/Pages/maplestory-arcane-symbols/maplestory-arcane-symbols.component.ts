import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import ArcaneSymbolsJson from '../../../../../../assets/Games/Maplestory/ArcaneSymbols.json';
import { ArcaneSymbol } from '../../Models/arcanesymbol';
import { VanishingJourneyComponent } from './Areas/vanishing-journey/vanishing-journey.component';
import { ChuChuComponent } from './Areas/chu-chu/chu-chu.component';
import { LacheleinComponent } from './Areas/lachelein/lachelein.component';
import { ArcanaComponent } from './Areas/arcana/arcana.component';
import { MorassComponent } from './Areas/morass/morass.component';
import { EsferaComponent } from './Areas/esfera/esfera.component';

@Component({
  selector: 'app-maplestory-arcane-symbols',
  templateUrl: './maplestory-arcane-symbols.component.html',
  styleUrls: ['./maplestory-arcane-symbols.component.css']
})
export class MaplestoryArcaneSymbolsComponent implements OnInit {
  @ViewChild(VanishingJourneyComponent, { static: false }) vanishingJourneyChild: VanishingJourneyComponent;
  @ViewChild(ChuChuComponent) chuChuChild: ChuChuComponent;
  @ViewChild(LacheleinComponent) lacheleinChild: LacheleinComponent;
  @ViewChild(ArcanaComponent) arcanaChild: ArcanaComponent;
  @ViewChild(MorassComponent) morassChild: MorassComponent;
  @ViewChild(EsferaComponent) esferaChild: EsferaComponent;

  arcaneSymbolList: ArcaneSymbol[] = ArcaneSymbolsJson.ArcaneSymbols;
  arcaneSymbolNames: string[] = ['Vanishing Journey', 'Chu Chu', 'Lachelein', 'Arcana', 'Morass', 'Esfera'];
  currentLevel: number = 1;
  currentXp: number = 1;
  activeSymbolIndex: number = 0;
  activeSymbolName: string = this.arcaneSymbolNames[0];

  daysLeft: number = 0;
  upgradeCost: number = 0;
  arcaneForceGain: number = 0;
  statGain: number = 0;
  xenonStatGain: number = 0;
  demonAvengerHpGain: number = 0;

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.currentLevel = localStorage.getItem("symbol" + this.activeSymbolIndex + "level") ? + localStorage.getItem("symbol" + this.activeSymbolIndex + "level") : 1;
    this.currentXp = localStorage.getItem("symbol" + this.activeSymbolIndex + "exp") ? + localStorage.getItem("symbol" + this.activeSymbolIndex + "exp") : 1;
    this.changeDetector.detectChanges();
    this.submit();
  }

  changeActiveSymbolIndex(value: number) {
    this.activeSymbolIndex = value;
    this.activeSymbolName = this.arcaneSymbolNames[value];

    this.currentLevel = localStorage.getItem("symbol" + this.activeSymbolIndex + "level") ? + localStorage.getItem("symbol" + this.activeSymbolIndex + "level") : 1;
    this.currentXp = localStorage.getItem("symbol" + this.activeSymbolIndex + "exp") ? + localStorage.getItem("symbol" + this.activeSymbolIndex + "exp") : 1;

    this.clearOutputVariables();

    this.changeDetector.detectChanges();
    this.submit();
  }

  submit() {
    switch (this.activeSymbolIndex) {
      case 0:
        this.calculateSymbolStats(this.vanishingJourneyChild.calculateDailySymbols());
        break;
      case 1:
        this.calculateSymbolStats(this.chuChuChild.calculateDailySymbols());
        break;
      case 2:
        this.calculateSymbolStats(this.lacheleinChild.calculateDailySymbols());
        break;
      case 3:
        this.calculateSymbolStats(this.arcanaChild.calculateDailySymbols());
        break;
      case 4:
        this.calculateSymbolStats(this.morassChild.calculateDailySymbols());
        break;
      case 5:
        this.calculateSymbolStats(this.esferaChild.calculateDailySymbols());
        break;
      default: {
        break;
      }
    }
  }

  currentLevelInput(event: any) {
    // reset output vars and exit out the method if there is no value present
    if (event.data == null && event.target.value != 1) {
      this.clearOutputVariables();
      return;
    }

    // if data was pasted in clear the input and exit method
    if (event.inputType == "insertFromPaste") {
      event.target.value = '';
      this.clearOutputVariables();
      return;
    }

    // prevents input of various symbols
    if (isNaN(event.data)) {
      event.target.value = '';
      this.currentLevel = 1;
    }

    // sets the lowest possible level if the user inputs a value that is too low
    if (this.currentLevel < 1 && event.target.value != "" || this.currentLevel % 1 != 0) {
      event.target.value = 1;
      this.currentLevel = 1;
    }

    // sets the highest possible level if the user inputs a value that is too high
    if (this.currentLevel > 20) {
      event.target.value = 20;
      this.currentLevel = 20;
    }

    // if the current xp is higher than the symbols required xp it is lowered to the symbols max xp and saved
    if (this.currentXp > this.arcaneSymbolList[this.currentLevel - 1].symbolExpRequired) {
      this.currentXp = this.arcaneSymbolList[this.currentLevel - 1].symbolExpRequired;
      localStorage.setItem("symbol" + this.activeSymbolIndex + "exp", this.currentXp.toString());
    }

    this.submit();
    localStorage.setItem("symbol" + this.activeSymbolIndex + "level", this.currentLevel.toString());
  }

  currentExpInput(event: any) {
    // reset output vars and exit out the method since there is no value
    if (event.data == null && event.target.value == "") {
      this.clearOutputVariables();
      return;
    }

    // if data was pasted in clear the input and exit method
    if (event.inputType == "insertFromPaste") {
      event.target.value = '';
      this.clearOutputVariables();
      return;
    }

    // sets currentlevel to 1 if its null
    if (this.currentLevel == null) {
      this.currentLevel = 1;
    }

    // prevents input of various symbols
    if (isNaN(event.data)) {
      event.target.value = '';
      this.currentXp = 1;
    }

    // if the current level is 1 the lowest possible experience is 1
    if (this.currentLevel == 1 && this.currentXp < 1 && event.target.value != "" || this.currentXp % 1 != 0) {
      event.target.value = 1;
      this.currentXp = 1;
    }

    // if the current level is not 1 the lowest possible experience is 0
    if (this.currentLevel != 1 && this.currentXp < 0 && event.target.value != "" || this.currentXp % 1 != 0) {
      event.target.value = 0;
      this.currentXp = 0;
    }

    // prevents input of numbers that are too high for current level
    if (this.currentXp > this.arcaneSymbolList[this.currentLevel - 1].symbolExpRequired) {
      event.target.value = this.arcaneSymbolList[this.currentLevel - 1].symbolExpRequired;
      this.currentXp = this.arcaneSymbolList[this.currentLevel - 1].symbolExpRequired;
    }

    this.submit();
    localStorage.setItem("symbol" + this.activeSymbolIndex + "exp", this.currentXp.toString());
  }

  calculateSymbolStats(symbolsPerDay: number) {
    var symbolsToGo: number = 0;

    symbolsToGo = (this.arcaneSymbolList[this.currentLevel - 1].symbolExpRequired - this.currentXp);
    this.upgradeCost = this.arcaneSymbolList[this.currentLevel - 1].upgradeCost;
    for (let i = this.currentLevel; i < 20; i++) {
      symbolsToGo += this.arcaneSymbolList[i].symbolExpRequired;
      this.upgradeCost += this.arcaneSymbolList[i].upgradeCost;
    }

    this.arcaneForceGain = this.arcaneSymbolList[19].arcaneForce - this.arcaneSymbolList[this.currentLevel - 1].arcaneForce;
    this.statGain = this.arcaneSymbolList[19].stat - this.arcaneSymbolList[this.currentLevel - 1].stat;
    this.xenonStatGain = this.arcaneSymbolList[19].statXenon - this.arcaneSymbolList[this.currentLevel - 1].statXenon;
    this.demonAvengerHpGain = this.arcaneSymbolList[19].statDemonAvenger - this.arcaneSymbolList[this.currentLevel - 1].statDemonAvenger;
    this.daysLeft = Math.ceil(symbolsToGo / symbolsPerDay);
  }

  clearOutputVariables() {
    this.daysLeft = 0;
    this.upgradeCost = 0;
    this.arcaneForceGain = 0;
    this.statGain = 0;
    this.xenonStatGain = 0;
    this.demonAvengerHpGain = 0;
  }
}