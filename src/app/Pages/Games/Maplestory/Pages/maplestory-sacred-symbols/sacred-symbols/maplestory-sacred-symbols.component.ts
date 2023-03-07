import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import SacredSymbolStatsJson from '../../../../../../../assets/Games/Maplestory/SacredSymbolStats.json';
import SacredSymbolCostJson from '../../../../../../../assets/Games/Maplestory/SacredSymbolCost.json';
import { SacredSymbol, SacredSymbolSaveData } from '../../../Models/sacredsymbolmodels';
import { CerniumComponent } from './Areas/cernium/cernium.component';
import { ArcusComponent } from './Areas/arcus/arcus.component';
import { OdiumComponent } from './Areas/odium/odium.component';
import { Meta, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-maplestory-sacred-symbols',
  templateUrl: './maplestory-sacred-symbols.component.html',
  styleUrls: ['./maplestory-sacred-symbols.component.css']
})
export class MaplestorySacredSymbolsComponent implements OnInit {
  @ViewChild(CerniumComponent, { static: false }) cerniumChild: CerniumComponent;
  @ViewChild(ArcusComponent) arcusChild: ArcusComponent;
  @ViewChild(OdiumComponent) odiumChild: OdiumComponent;

  sacredSymbolSaveData: SacredSymbolSaveData;
  sacredSymbolStats: SacredSymbol[] = SacredSymbolStatsJson.SacredSymbolsStats;
  sacredSymbolCost: number[] = SacredSymbolCostJson.Cernium;
  sacredSymbolNames: string[] = ['Cernium', 'Arcus', 'Odium'];
  currentLevel: number = 1;
  currentXp: number = 1;
  activeSymbolIndex: number = 0;

  daysLeft: number = 0;
  upgradeCost: number = 0;
  sacredForceGain: number = 0;
  statGain: number = 0;
  xenonStatGain: number = 0;
  demonAvengerHpGain: number = 0;

  constructor(private changeDetector: ChangeDetectorRef, private titleService: Title, private metaService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("Maplestory Sacred Symbol Calculator | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "A sacred symbol calculator to determine the amount of time & money required to max out a symbol."});
    if(!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }

    this.initialise();
  }

  initialise() {
    if (localStorage.getItem("sacredSymbolSaveDataV2")) {
      this.sacredSymbolSaveData = JSON.parse(localStorage.getItem("sacredSymbolSaveDataV2"));
    } else {
      // initiate a dataset
      this.initiateData();
    }
    // call function to populate the input fields with correct data
    this.changeActiveSymbolIndex(0);
  }

  initiateData() {
    var newSacredSymbolSaveData: SacredSymbolSaveData = {
      cerniumLevel: 1,
      cerniumExp: 1,
      cerniumDailyQuest: true,
      burningCerniumDailyQuest: false,
      arcusLevel: 1,
      arcusExp: 1,
      arcusDailyQuest: true,
      odiumLevel: 1,
      odiumExp: 1,
      odiumDailyQuest: true
    };
    this.sacredSymbolSaveData = newSacredSymbolSaveData;
    localStorage.setItem("sacredSymbolSaveDataV2", JSON.stringify(this.sacredSymbolSaveData));
  }

  changeActiveSymbolIndex(value: number) {
    this.activeSymbolIndex = value;
    this.changeDetector.detectChanges();
    switch (this.activeSymbolIndex) {
      case 0:
        this.sacredSymbolCost = SacredSymbolCostJson.Cernium
        this.currentLevel = this.sacredSymbolSaveData.cerniumLevel;
        this.currentXp = this.sacredSymbolSaveData.cerniumExp;
        this.cerniumChild.cerniumDailyQuest = this.sacredSymbolSaveData.cerniumDailyQuest;
        this.cerniumChild.burningCerniumDailyQuest = this.sacredSymbolSaveData.burningCerniumDailyQuest;
        break;
      case 1:
        this.sacredSymbolCost = SacredSymbolCostJson.Arcus;
        this.currentLevel = this.sacredSymbolSaveData.arcusLevel;
        this.currentXp = this.sacredSymbolSaveData.arcusExp;
        this.arcusChild.dailyQuest = this.sacredSymbolSaveData.arcusDailyQuest;
        break;
      case 2:
        this.sacredSymbolCost = SacredSymbolCostJson.Odium;
        this.currentLevel = this.sacredSymbolSaveData.odiumLevel;
        this.currentXp = this.sacredSymbolSaveData.odiumExp;
        this.odiumChild.dailyQuest = this.sacredSymbolSaveData.odiumDailyQuest;
        break;
      default: {
        break;
      }
    }
    this.clearOutputVariables();
    this.submit();
  }

  submit() {
    switch (this.activeSymbolIndex) {
      case 0:
        this.calculateSymbolStats(this.cerniumChild.calculateDailySymbols());
        break;
      case 1:
        this.calculateSymbolStats(this.arcusChild.calculateDailySymbols());
        break;
      case 2:
        this.calculateSymbolStats(this.odiumChild.calculateDailySymbols());
        break;
      default: {
        break;
      }
    }
    // update the saved data everytime a submit happens
    this.updateSavedData();
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
    if (this.currentLevel > 11) {
      event.target.value = 11;
      this.currentLevel = 11;
    }

    // if the level is set back to 1 and the currentXp is 0, the xp needs to be raised to 1 as this is the xp any symbol starts with
    if(this.currentLevel == 1 && this.currentXp == 0) {
      this.currentXp = 1;
    }


    // Calculate the total amount of symbols needed to reach the max level.
    var totalSymbolsToGo = 0;
    for (let i = this.currentLevel - 1; i < 11; i++) {
      totalSymbolsToGo += this.sacredSymbolStats[i].symbolExpRequired;
    }

    // ensure the currentXp is adjusted if it is higher than the total symbols required
    if (this.currentXp > totalSymbolsToGo) {
      this.currentXp = totalSymbolsToGo;
    }

    this.submit();
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


    // Calculate the total amount of symbols needed to reach the max level.
    var totalSymbolsToGo = 0;
    for (let i = this.currentLevel - 1; i < 11; i++) {
      totalSymbolsToGo += this.sacredSymbolStats[i].symbolExpRequired;
    }

    // prevents input of numbers that go beyond the total symbols required
    if (this.currentXp > totalSymbolsToGo) {
      event.target.value = totalSymbolsToGo;
      this.currentXp = totalSymbolsToGo;
    }

    this.submit();
  }

  updateSavedData() {
    switch (this.activeSymbolIndex) {
      case 0:
        this.sacredSymbolSaveData.cerniumLevel = this.currentLevel;
        this.sacredSymbolSaveData.cerniumExp = this.currentXp;
        this.sacredSymbolSaveData.cerniumDailyQuest = this.cerniumChild.cerniumDailyQuest;
        this.sacredSymbolSaveData.burningCerniumDailyQuest = this.cerniumChild.burningCerniumDailyQuest;
        break;
      case 1:
        this.sacredSymbolSaveData.arcusLevel = this.currentLevel;
        this.sacredSymbolSaveData.arcusExp = this.currentXp;
        this.sacredSymbolSaveData.arcusDailyQuest = this.arcusChild.dailyQuest;
        break;
      case 2:
          this.sacredSymbolSaveData.odiumLevel = this.currentLevel;
          this.sacredSymbolSaveData.odiumExp = this.currentXp;
          this.sacredSymbolSaveData.odiumDailyQuest = this.odiumChild.dailyQuest;
          break;
      default: {
        break;
      }
    }
    localStorage.setItem("sacredSymbolSaveDataV2", JSON.stringify(this.sacredSymbolSaveData));
  }

  calculateSymbolStats(symbolsPerDay: number) {
    var symbolsToGo: number = 0;

    symbolsToGo = (this.sacredSymbolStats[this.currentLevel - 1].symbolExpRequired - this.currentXp);
    this.upgradeCost = this.sacredSymbolCost[this.currentLevel - 1];
    for (let i = this.currentLevel; i < 11; i++) {
      symbolsToGo += this.sacredSymbolStats[i].symbolExpRequired;
      this.upgradeCost += this.sacredSymbolCost[i];
    }

    this.sacredForceGain = this.sacredSymbolStats[10].sacredForce - this.sacredSymbolStats[this.currentLevel - 1].sacredForce;
    this.statGain = this.sacredSymbolStats[10].stat - this.sacredSymbolStats[this.currentLevel - 1].stat;
    this.xenonStatGain = this.sacredSymbolStats[10].statXenon - this.sacredSymbolStats[this.currentLevel - 1].statXenon;
    this.demonAvengerHpGain = this.sacredSymbolStats[10].statDemonAvenger - this.sacredSymbolStats[this.currentLevel - 1].statDemonAvenger;
    this.daysLeft = Math.ceil(symbolsToGo / symbolsPerDay);
  }

  clearOutputVariables() {
    this.daysLeft = 0;
    this.upgradeCost = 0;
    this.sacredForceGain = 0;
    this.statGain = 0;
    this.xenonStatGain = 0;
    this.demonAvengerHpGain = 0;
  }
}