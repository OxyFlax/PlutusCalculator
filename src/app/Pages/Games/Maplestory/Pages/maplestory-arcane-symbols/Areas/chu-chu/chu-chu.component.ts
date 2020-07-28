import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chu-chu',
  templateUrl: './chu-chu.component.html',
  styleUrls: ['./chu-chu.component.css']
})
export class ChuChuComponent implements OnInit {
  @Output() valueChange = new EventEmitter();
  @Output() clearOutput = new EventEmitter();
  dailyQuest: boolean = true;
  hungryMuto: number = 0;

  ngOnInit() {
    var dailyQuestStoredValue: number;
    dailyQuestStoredValue = localStorage.getItem("chuchudailyquest") ?  + localStorage.getItem("chuchudailyquest") : 1;
    this.dailyQuest = !!dailyQuestStoredValue; 

    this.hungryMuto = localStorage.getItem("hungrymuto") ?  + localStorage.getItem("hungrymuto") : 1;
  }

  dailyQuestChangeHandler(){
    if(this.dailyQuest) {
      localStorage.setItem("chuchudailyquest", "1");
    } else {
      localStorage.setItem("chuchudailyquest", "0");
    }
    this.valueChanged();
  }

  hungryMutoInput(event: any) {    
    console.log(event);
    // set value to 0 and exit out the method since there is no value given
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
      this.hungryMuto = 0;
    }

    // sets the lowest possible amount if the user inputs a value that is too low
    if (this.hungryMuto < 0 && event.target.value != "" || this.hungryMuto % 1 != 0) {
      event.target.value = 0;
      this.hungryMuto = 0;
    }

    // sets the highest possible amount if the user inputs a value that is too high
    if (this.hungryMuto > 15) {
      event.target.value = 15;
      this.hungryMuto = 15;
    }

    this.valueChanged();
    localStorage.setItem("hungrymuto", this.hungryMuto.toString());
  }

  public calculateDailySymbols(): number {
    var symbolsPerDay: number = 0;

    if (this.dailyQuest) {
      symbolsPerDay += 4;
    }

    symbolsPerDay += +this.hungryMuto;

    return symbolsPerDay;
  }

  valueChanged() {
    this.valueChange.emit();
  }

  emitClearOutput(){
    this.clearOutput.emit();
  }
}