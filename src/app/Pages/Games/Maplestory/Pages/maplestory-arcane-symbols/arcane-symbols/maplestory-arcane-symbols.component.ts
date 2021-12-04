import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import ArcaneSymbolsJson from '../../../../../../../assets/Games/Maplestory/ArcaneSymbols.json';
import { ArcaneSymbol } from '../../../Models/arcanesymbol';
import { ArcaneSymbolSaveData } from '../../../Models/arcanesymbolsavedata';
import { VanishingJourneyComponent } from './Areas/vanishing-journey/vanishing-journey.component';
import { ChuChuComponent } from './Areas/chu-chu/chu-chu.component';
import { LacheleinComponent } from './Areas/lachelein/lachelein.component';
import { ArcanaComponent } from './Areas/arcana/arcana.component';
import { MorassComponent } from './Areas/morass/morass.component';
import { EsferaComponent } from './Areas/esfera/esfera.component';
import { Meta, Title } from '@angular/platform-browser';

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

  arcaneSymbolSaveData: ArcaneSymbolSaveData;
  arcaneSymbolList: ArcaneSymbol[] = ArcaneSymbolsJson.arcaneSymbols;
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

  constructor(private changeDetector: ChangeDetectorRef, private titleService: Title, private metaService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("Maplestory Arcane Symbol Calculator | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "An arcane symbol calculator to determine the amount of time & money required to max out a symbol."});
    if(!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }

    this.initialise();
  }

  initialise() {
    if (localStorage.getItem("arcaneSymbolSaveData")) {
      this.arcaneSymbolSaveData = JSON.parse(localStorage.getItem("arcaneSymbolSaveData"));
    } else {
      // initiate a dataset
      this.initiateData();
    }
    // call function to populate the input fields with correct data
    this.changeActiveSymbolIndex(0);
  }

  initiateData() {
    var newArcaneSymbolSaveData: ArcaneSymbolSaveData = {
      vjLevel: 1,
      vjExp: 1,
      vjDailyQuest: true,
      vjErdaSpectrum: true,
      vjReverseCity: false,
      chuchuLevel: 1,
      chuchuExp: 1,
      chuchuDailyQuest: true,
      chuchuHungryMuto: 1,
      chuchuYumYumIsland: false,
      lacheleinLevel: 1,
      lacheleinExp: 1,
      lacheleinDailyQuest: true,
      lacheleinDreamDefender: 1,
      arcanaLevel: 1,
      arcanaExp: 1,
      arcanaDailyQuest: true,
      arcanaSpiritSaviour: 1,
      morassLevel: 1,
      morassExp: 1,
      morassDailyQuest: true,
      esferaLevel: 1,
      esferaExp: 1,
      esferaDailyQuest: true
    };
    this.arcaneSymbolSaveData = newArcaneSymbolSaveData;
    localStorage.setItem("arcaneSymbolSaveData", JSON.stringify(this.arcaneSymbolSaveData));
  }

  changeActiveSymbolIndex(value: number) {
    this.activeSymbolIndex = value;
    this.activeSymbolName = this.arcaneSymbolNames[value];
    this.changeDetector.detectChanges();
    switch (this.activeSymbolIndex) {
      case 0:
        this.currentLevel = this.arcaneSymbolSaveData.vjLevel;
        this.currentXp = this.arcaneSymbolSaveData.vjExp;
        this.vanishingJourneyChild.dailyQuest = this.arcaneSymbolSaveData.vjDailyQuest;
        this.vanishingJourneyChild.erdaSpectrum = this.arcaneSymbolSaveData.vjErdaSpectrum;
        this.vanishingJourneyChild.reverseCity = this.arcaneSymbolSaveData.vjReverseCity;
        break;
      case 1:
        this.currentLevel = this.arcaneSymbolSaveData.chuchuLevel;
        this.currentXp = this.arcaneSymbolSaveData.chuchuExp;
        this.chuChuChild.dailyQuest = this.arcaneSymbolSaveData.chuchuDailyQuest;
        this.chuChuChild.hungryMuto = this.arcaneSymbolSaveData.chuchuHungryMuto;
        this.chuChuChild.yumYumIsland = this.arcaneSymbolSaveData.chuchuYumYumIsland;
        break;
      case 2:
        this.currentLevel = this.arcaneSymbolSaveData.lacheleinLevel;
        this.currentXp = this.arcaneSymbolSaveData.lacheleinExp;
        this.lacheleinChild.dailyQuest = this.arcaneSymbolSaveData.lacheleinDailyQuest;
        this.lacheleinChild.dreamDefender = this.arcaneSymbolSaveData.lacheleinDreamDefender;
        break;
      case 3:
        this.currentLevel = this.arcaneSymbolSaveData.arcanaLevel;
        this.currentXp = this.arcaneSymbolSaveData.arcanaExp;
        this.arcanaChild.dailyQuest = this.arcaneSymbolSaveData.arcanaDailyQuest;
        this.arcanaChild.spiritSaviour = this.arcaneSymbolSaveData.arcanaSpiritSaviour;
        break;
      case 4:
        this.currentLevel = this.arcaneSymbolSaveData.morassLevel;
        this.currentXp = this.arcaneSymbolSaveData.morassExp;
        this.morassChild.dailyQuest = this.arcaneSymbolSaveData.morassDailyQuest;
        break;
      case 5:
        this.currentLevel = this.arcaneSymbolSaveData.esferaLevel;
        this.currentXp = this.arcaneSymbolSaveData.esferaExp;
        this.esferaChild.dailyQuest = this.arcaneSymbolSaveData.esferaDailyQuest;
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
    if (this.currentLevel > 20) {
      event.target.value = 20;
      this.currentLevel = 20;
    }

    // if the level is set back to 1 and the currentXp is 0, the xp needs to be raised to 1 as this is the xp any symbol starts with
    if(this.currentLevel == 1 && this.currentXp == 0) {
      this.currentXp = 1;
    }


    // Calculate the total amount of symbols needed to reach the max level.
    var totalSymbolsToGo = 0;
    for (let i = this.currentLevel - 1; i < 20; i++) {
      totalSymbolsToGo += this.arcaneSymbolList[i].symbolExpRequired;
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
    for (let i = this.currentLevel - 1; i < 20; i++) {
      totalSymbolsToGo += this.arcaneSymbolList[i].symbolExpRequired;
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
        this.arcaneSymbolSaveData.vjLevel = this.currentLevel;
        this.arcaneSymbolSaveData.vjExp = this.currentXp;
        this.arcaneSymbolSaveData.vjDailyQuest = this.vanishingJourneyChild.dailyQuest;
        this.arcaneSymbolSaveData.vjErdaSpectrum = this.vanishingJourneyChild.erdaSpectrum;
        this.arcaneSymbolSaveData.vjReverseCity = this.vanishingJourneyChild.reverseCity;
        break;
      case 1:
        this.arcaneSymbolSaveData.chuchuLevel = this.currentLevel;
        this.arcaneSymbolSaveData.chuchuExp = this.currentXp;
        this.arcaneSymbolSaveData.chuchuDailyQuest = this.chuChuChild.dailyQuest;
        this.arcaneSymbolSaveData.chuchuHungryMuto = this.chuChuChild.hungryMuto;
        this.arcaneSymbolSaveData.chuchuYumYumIsland = this.chuChuChild.yumYumIsland;
        break;
      case 2:
        this.arcaneSymbolSaveData.lacheleinLevel = this.currentLevel;
        this.arcaneSymbolSaveData.lacheleinExp = this.currentXp;
        this.arcaneSymbolSaveData.lacheleinDailyQuest = this.lacheleinChild.dailyQuest;
        this.arcaneSymbolSaveData.lacheleinDreamDefender = this.lacheleinChild.dreamDefender;
        break;
      case 3:
        this.arcaneSymbolSaveData.arcanaLevel = this.currentLevel;
        this.arcaneSymbolSaveData.arcanaExp = this.currentXp;
        this.arcaneSymbolSaveData.arcanaDailyQuest = this.arcanaChild.dailyQuest;
        this.arcaneSymbolSaveData.arcanaSpiritSaviour = this.arcanaChild.spiritSaviour;
        break;
      case 4:
        this.arcaneSymbolSaveData.morassLevel = this.currentLevel;
        this.arcaneSymbolSaveData.morassExp = this.currentXp;
        this.arcaneSymbolSaveData.morassDailyQuest = this.morassChild.dailyQuest;
        break;
      case 5:
        this.arcaneSymbolSaveData.esferaLevel = this.currentLevel;
        this.arcaneSymbolSaveData.esferaExp = this.currentXp;
        this.arcaneSymbolSaveData.esferaDailyQuest = this.esferaChild.dailyQuest;
        break;
      default: {
        break;
      }
    }
    localStorage.setItem("arcaneSymbolSaveData", JSON.stringify(this.arcaneSymbolSaveData));
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