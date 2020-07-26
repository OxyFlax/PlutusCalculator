import { Component, OnInit } from '@angular/core';
import ArcaneSymbolsJson from '../../../../../../assets/Games/Maplestory/ArcaneSymbols.json';
import { ArcaneSymbol } from '../../Models/arcanesymbol';

@Component({
  selector: 'app-maplestory-arcane-symbols',
  templateUrl: './maplestory-arcane-symbols.component.html',
  styleUrls: ['./maplestory-arcane-symbols.component.css']
})
export class MaplestoryArcaneSymbolsComponent implements OnInit {
  arcaneSymbolList: ArcaneSymbol[] = ArcaneSymbolsJson.ArcaneSymbols;
  currentLevel: number = 1;
  currentXp: number = 1;
  symbolsPerDay: number = 14;

  constructor() {
  }

  
  ngOnInit() {
    // var currentLevel: number = 18;
    // var currentXp: number = 261;
    // var symbolsPerDay: number = 8;

    // this.calculate(currentLevel, currentXp, symbolsPerDay);
  }


  submit() {
    this.calculate();
  }

  currentLevelInput(event: any) {
    // prevents input of various symbols
    if (event.data == "-" || event.data == "+" || event.data == "." || event.data == ",") {
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
  }

  currentExpInput(event: any) {
    // sets currentlevel to 1 if its null
    if (this.currentLevel == null) {
      this.currentLevel = 1;
    }

    // prevents input of various symbols
    if (event.data == "-" || event.data == "+" || event.data == "." || event.data == ",") {
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
  }

  calculate() {
    var symbolsToGo: number = 0;
    var totalUpgradeCost: number = 0;

    symbolsToGo = (this.arcaneSymbolList[this.currentLevel - 1].symbolExpRequired - this.currentXp);
    totalUpgradeCost = this.arcaneSymbolList[this.currentLevel - 1].upgradeCost;
    for (let i = this.currentLevel; i < 20; i++) {
      symbolsToGo += this.arcaneSymbolList[i].symbolExpRequired;
      totalUpgradeCost += this.arcaneSymbolList[i].upgradeCost;
    }

    console.log("Symbols to go: " + symbolsToGo + " | Meso Required: " + totalUpgradeCost + " | Days Left: " + Math.ceil(symbolsToGo / this.symbolsPerDay));
  }
}