import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-arcana',
  templateUrl: './arcana.component.html',
  styleUrls: ['./arcana.component.css']
})
export class ArcanaComponent implements OnInit{
  @Output() valueChange = new EventEmitter();
  @Output() clearOutput = new EventEmitter();
  dailyQuest: boolean = true;
  spiritSaviour: number = 0;

  ngOnInit() {
    var dailyQuestStoredValue: number;
    dailyQuestStoredValue = localStorage.getItem("arcanadailyquest") ?  + localStorage.getItem("arcanadailyquest") : 1;
    this.dailyQuest = !!dailyQuestStoredValue; 

    this.spiritSaviour = localStorage.getItem("spiritSaviour") ?  + localStorage.getItem("spiritSaviour") : 1;
  }

  dailyQuestChangeHandler(){
    if(this.dailyQuest) {
      localStorage.setItem("arcanadailyquest", "1");
    } else {
      localStorage.setItem("arcanadailyquest", "0");
    }
    this.valueChanged();
  }
  
  spiritSaviourInput(event: any) {    // set value to 0 and exit out the method since there is no value given
    if (event.data == null && event.target.value == "") {
      this.emitClearOutput();
      return;
    }

    // if data was pasted in set values to 1
    if (event.inputType == "insertFromPaste") {
      this.emitClearOutput();
      return;
    }

    // prevents input of various symbols
    if (isNaN(event.data)) {
      event.target.value = 0;
      this.spiritSaviour = 0;
    }

    // sets the lowest possible amount if the user inputs a value that is too low
    if (this.spiritSaviour < 0 && event.target.value != "" || this.spiritSaviour % 1 != 0) {
      event.target.value = 0;
      this.spiritSaviour = 0;
    }

    // sets the highest possible amount if the user inputs a value that is too high
    if (this.spiritSaviour > 10) {
      event.target.value = 10;
      this.spiritSaviour = 10;
    }

    this.valueChanged();
    localStorage.setItem("spiritSaviour", this.spiritSaviour.toString());
  }

  public calculateDailySymbols(): number {
    var symbolsPerDay: number = 0;

    if (this.dailyQuest) {
      symbolsPerDay += 8;
    }

    symbolsPerDay += +this.spiritSaviour;

    return symbolsPerDay;
  }

  valueChanged() {
    this.valueChange.emit();
  }

  emitClearOutput(){
    this.clearOutput.emit();
  }
}