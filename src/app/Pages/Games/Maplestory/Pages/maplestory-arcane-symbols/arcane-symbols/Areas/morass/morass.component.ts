import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-morass',
  templateUrl: './morass.component.html',
  styleUrls: ['./morass.component.css']
})
export class MorassComponent implements OnInit{
  @Output() valueChange = new EventEmitter();
  dailyQuest: boolean = true;
  ranheimDefense: boolean = true;

  ngOnInit() {
  }

  public calculateDailySymbols(): number {
    var dailySymbols: number = 0;

    if (this.dailyQuest) {
      dailySymbols += 20;
    }

    // this is a weekly so divide the number by seven for daily average
    if (this.ranheimDefense) {
      dailySymbols += 45/7;
    }

    return dailySymbols;
  }

  valueChanged() {
    this.valueChange.emit();
  }
}