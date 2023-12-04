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
  spiritSaviour: boolean = true;

  ngOnInit() {
  }

  public calculateDailySymbols(): number {
    var dailySymbols: number = 0;

    if (this.dailyQuest) {
      dailySymbols += 20;
    }

    // this is a weekly so divide the number by seven for daily average
    if (this.spiritSaviour) {
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