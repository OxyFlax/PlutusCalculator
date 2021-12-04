import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-lachelein',
  templateUrl: './lachelein.component.html',
  styleUrls: ['./lachelein.component.css']
})
export class LacheleinComponent implements OnInit{
  @Output() valueChange = new EventEmitter();
  @Output() clearOutput = new EventEmitter();
  dailyQuest: boolean = true;
  dreamDefender: number = 0;

  ngOnInit() {
  }

  dreamDefenderInput(event: any) {    
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
      this.dreamDefender = 0;
    }

    // sets the lowest possible amount if the user inputs a value that is too low
    if (this.dreamDefender < 0 && event.target.value != "" || this.dreamDefender % 1 != 0) {
      event.target.value = 0;
      this.dreamDefender = 0;
    }

    // sets the highest possible amount if the user inputs a value that is too high
    if (this.dreamDefender > 30) {
      event.target.value = 30;
      this.dreamDefender = 30;
    }

    this.valueChanged();
  }

  public calculateDailySymbols(): number {
    var symbolsPerDay: number = 0;

    if (this.dailyQuest) {
      symbolsPerDay += 8;
    }

    symbolsPerDay += +this.dreamDefender;

    return symbolsPerDay;
  }

  valueChanged() {
    this.valueChange.emit();
  }

  emitClearOutput(){
    this.clearOutput.emit();
  }
}