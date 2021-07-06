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
  yumYumIsland: boolean = false;

  ngOnInit() {
  }

  hungryMutoInput(event: any) {    
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
  }

  public calculateDailySymbols(): number {
    var symbolsPerDay: number = 0;

    if (this.dailyQuest) {
      symbolsPerDay += 4;
    }

    symbolsPerDay += +this.hungryMuto;

    // if yum yum island is unlocked add an extra 8 symbols
    if (this.yumYumIsland) {
      symbolsPerDay += 4;
    }

    return symbolsPerDay;
  }

  valueChanged() {
    this.valueChange.emit();
  }

  emitClearOutput(){
    this.clearOutput.emit();
  }
}