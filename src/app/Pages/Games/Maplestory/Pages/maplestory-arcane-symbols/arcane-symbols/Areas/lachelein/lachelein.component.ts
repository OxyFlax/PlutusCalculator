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
  midnightChaser: boolean = true;

  ngOnInit() {
  }

  public calculateDailySymbols(): number {
    var dailySymbols: number = 0;

    if (this.dailyQuest) {
      dailySymbols += 20;
    }

    // this is a weekly so divide the number by seven for daily average
    if (this.midnightChaser) {
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