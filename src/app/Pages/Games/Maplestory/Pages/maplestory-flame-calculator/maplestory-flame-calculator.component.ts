import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchSelectComponent } from '../../../../../Components/search-select/search-select.component';
import ClassesJson from '../../../../../../assets/Games/Maplestory/Classes.json';
import { Class } from '../../Models/class';
import { Flame } from '../../Models/flame';
import { FlameData } from '../../Models/flamedata';
import { FlameSaveData } from '../../Models/flameSaveData';

@Component({
  selector: 'app-maplestory-flame-calculator',
  templateUrl: './maplestory-flame-calculator.component.html',
  styleUrls: ['./maplestory-flame-calculator.component.css']
})
export class MaplestoryFlameCalculatorComponent implements OnInit {
  @ViewChild(SearchSelectComponent) searchSelectChild: SearchSelectComponent;

  public classes = ClassesJson.classes;
  selectedClass: Class;
  characterIndex: number = 0;

  flameData: FlameData;
  flameScore: number = 0;
  currentFlame: Flame = {
    str: null,
    dex: null,
    luk: null,
    int: null,
    hp: null,
    mp: null,
    att: null,
    matt: null,
    allstat: null
  };

  editModeActive: boolean = false;
  editButtonMessage: string = "Settings";

  constructor() { }

  ngOnInit() {
    this.initialise();
  }

  initialise() {
    if (localStorage.getItem("flameData")) {
      this.flameData = JSON.parse(localStorage.getItem("flameData"));
    } else {
      // initiate a dataset
      this.initiateData();
    }
  }

  initiateData() {
    var newEmptyFlame: Flame = {
      str: null,
      dex: null,
      luk: null,
      int: null,
      hp: null,
      mp: null,
      att: null,
      matt: null,
      allstat: null
    }

    var newSaveDataPreset: FlameSaveData = {
      characterName: "",
      selectedClassIndex: 3,
      hat: newEmptyFlame,
      top: newEmptyFlame,
      belt: newEmptyFlame,
      bottom: newEmptyFlame,
      shoes: newEmptyFlame,
      gloves: newEmptyFlame,
      cape: newEmptyFlame,
      shoulder: newEmptyFlame,
      weapon: newEmptyFlame,
      pocket: newEmptyFlame,
      pendant1: newEmptyFlame,
      pendant2: newEmptyFlame,
      face: newEmptyFlame,
      eye: newEmptyFlame,
      earrings: newEmptyFlame
    };

    var newSaveDataArray: FlameSaveData[] = [];

    // populate the newSaveDataArray with 4 versions of the newSaveDataPreset
    for (let i = 0; i < 4; i++) {
      newSaveDataPreset.characterName = "char" + (i + 1);
      newSaveDataArray.push(JSON.parse(JSON.stringify(newSaveDataPreset)));
    }

    var newFlameData: FlameData = {
      mainStatMultiplier: 1,
      secondaryStatMultiplier: 0.125,
      hpMpMultiplier: 0.014285,
      attMattMultiplier: 4,
      allstatMultiplier: 8.5,
      xenonAllstatMultiplier: 15,
      lukDoubleSecondaryAllStatMultiplier: 9,
      saveData: newSaveDataArray
    };

    this.flameData = newFlameData;
  }

  updateSelectedClass(selectedClass: any) {
    this.selectedClass = selectedClass;

    // this ensures flames won't contain information not related to their type
    this.resetValues();

    // find the index of the newly selected class and save the flameData with this updated index
    this.flameData.saveData[this.characterIndex].selectedClassIndex = this.classes.findIndex(x => x.name == selectedClass.name);
    localStorage.setItem("flameData", JSON.stringify(this.flameData));
  }

  calculateScore(flame: Flame): number {
    var score: number;

    switch (this.selectedClass.flameType) {
      case 'str':
        score = this.calculateStrTypeScore(flame);
        break;
      case 'dex':
        score = this.calculateDexTypeScore(flame);
        break;
      case 'luk':
        score = this.calculateLukTypeScore(flame);
        break;
      case 'int':
        score = this.calculateIntTypeScore(flame);
        break;
      case 'lukDoubleSecondary':
        score = this.calculateLukDoubleSecondaryTypeScore(flame);
        break;
      case 'kanna':
        score = this.calculateKannaTypeScore(flame);
        break;
      case 'xenon':
        score = this.calculateXenonTypeScore(flame);
        break;
      case 'da':
        score = this.calculateDaTypeScore();
        break;
      default:
        break;
    }

    score = Math.round((score + Number.EPSILON) * 10) / 10

    if(score > 999) {
      score = 999;
    }

    return score;
  }

  inputHandler() {
    this.flameScore = this.calculateScore(this.currentFlame);
    localStorage.setItem("flameData", JSON.stringify(this.flameData));
  }

  calculateStrTypeScore(flame: Flame) {
    return (flame.str * this.flameData.mainStatMultiplier)
    + (flame.dex * this.flameData.secondaryStatMultiplier)
    + (flame.att * this.flameData.attMattMultiplier)
    + (flame.allstat * this.flameData.allstatMultiplier);
  }

  calculateDexTypeScore(flame: Flame): number {
    return (flame.dex * this.flameData.mainStatMultiplier)
    + (flame.str * this.flameData.secondaryStatMultiplier)
    + (flame.att * this.flameData.attMattMultiplier)
    + (flame.allstat * this.flameData.allstatMultiplier);
  }

  calculateLukTypeScore(flame: Flame): number {
    return (flame.luk * this.flameData.mainStatMultiplier)
    + (flame.dex * this.flameData.secondaryStatMultiplier)
    + (flame.att * this.flameData.attMattMultiplier)
    + (flame.allstat * this.flameData.allstatMultiplier);
  }

  calculateIntTypeScore(flame: Flame): number {
    return (flame.int * this.flameData.mainStatMultiplier)
    + (flame.luk * this.flameData.secondaryStatMultiplier)
    + (flame.matt * this.flameData.attMattMultiplier)
    + (flame.allstat * this.flameData.allstatMultiplier);
  }

  calculateLukDoubleSecondaryTypeScore(flame: Flame): number {
    return (this.currentFlame.luk * this.flameData.mainStatMultiplier) 
    + (flame.dex * this.flameData.secondaryStatMultiplier) 
    + (flame.str * this.flameData.secondaryStatMultiplier) 
    + (flame.att * this.flameData.attMattMultiplier) 
    + (flame.allstat * this.flameData.lukDoubleSecondaryAllStatMultiplier);
  }

  calculateKannaTypeScore(flame: Flame): number {
    return (flame.int * this.flameData.mainStatMultiplier)
    + (flame.luk * this.flameData.secondaryStatMultiplier)
    + (flame.matt * this.flameData.attMattMultiplier)
    + (flame.allstat * this.flameData.allstatMultiplier)
    + (flame.hp * this.flameData.hpMpMultiplier)
    + (flame.mp * this.flameData.hpMpMultiplier);
  }

  calculateXenonTypeScore(flame: Flame): number {
    return (flame.luk * this.flameData.mainStatMultiplier)
    + (flame.dex * this.flameData.mainStatMultiplier)
    + (flame.str * this.flameData.mainStatMultiplier)
    + (flame.att * this.flameData.attMattMultiplier)
    + (flame.allstat * this.flameData.xenonAllstatMultiplier);
  }

  calculateDaTypeScore(): number {
    console.log("not really a calculation for this lmao yeet");
    return 0;
  }

  resetValues() {
    this.currentFlame.str = null;
    this.currentFlame.dex = null;
    this.currentFlame.luk = null;
    this.currentFlame.int = null;
    this.currentFlame.hp = null;
    this.currentFlame.mp = null;
    this.currentFlame.att = null;
    this.currentFlame.matt = null;
    this.currentFlame.allstat = null;

    this.flameScore = 0;
  }

  changeCharacter(index: number) {
    this.characterIndex = index;
    // give this the class from the saved thingiemagig
    this.searchSelectChild.returnItem(this.classes[this.flameData.saveData[index].selectedClassIndex]);
  }

  saveFlame(equipName: string) {
    this.flameData.saveData[this.characterIndex][equipName] = JSON.parse(JSON.stringify(this.currentFlame));
    localStorage.setItem("flameData", JSON.stringify(this.flameData));
  }

  loadFlame(equipName: any) {
    this.currentFlame = JSON.parse(JSON.stringify(this.flameData.saveData[this.characterIndex][equipName]));
    this.inputHandler();
  }

  toggleEditMode() {
    if (this.editModeActive) {
      this.editModeActive = false;
      this.editButtonMessage = "Settings";
      // save the changes made in edit mode (names/multipliers)
      localStorage.setItem("flameData", JSON.stringify(this.flameData));
    } else {
      this.editModeActive = true;
      this.editButtonMessage = "Exit Settings";
    }
  }

  enablePreset(presetOption: string) {
    if(presetOption == "scardorLateGame") {
      this.flameData.mainStatMultiplier = 1;
      this.flameData.secondaryStatMultiplier = 0.125;
      this.flameData.hpMpMultiplier = 0.014285;
      this.flameData.attMattMultiplier = 4;
      this.flameData.allstatMultiplier = 8.5;
      this.flameData.xenonAllstatMultiplier = 15;
      this.flameData.lukDoubleSecondaryAllStatMultiplier = 9;
      return;
    }

    if(presetOption == "scardorEndGame") {
      this.flameData.mainStatMultiplier = 1;
      this.flameData.secondaryStatMultiplier = 0.1;
      this.flameData.hpMpMultiplier = 0.01;
      this.flameData.attMattMultiplier = 3;
      this.flameData.allstatMultiplier = 9;
      this.flameData.xenonAllstatMultiplier = 22;
      this.flameData.lukDoubleSecondaryAllStatMultiplier = 10;
      return;
    }
  }
}