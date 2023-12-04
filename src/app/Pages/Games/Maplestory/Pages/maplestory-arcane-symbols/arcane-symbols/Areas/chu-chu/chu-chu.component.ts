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
  yumYumIsland: boolean = false;
  hungryMuto: boolean = true;

  ngOnInit() {
  }

  public calculateDailySymbols(): number {
    var dailySymbols: number = 0;

    if (this.dailyQuest) {
      dailySymbols += 10;
    }

    // if yum yum island is unlocked add an extra 8 symbols
    if (this.yumYumIsland) {
      dailySymbols += 10;
    }

    // this is a weekly so divide the number by seven for daily average
    if (this.hungryMuto) {
      dailySymbols += 45/7;
    }

    return dailySymbols;
  }

  valueChanged() {
    this.valueChange.emit();
  }

  emitClearOutput(){
    this.clearOutput.emit();
  }
}