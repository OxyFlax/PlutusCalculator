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
    var symbolsPerDay: number = 0;

    if (this.dailyQuest) {
      symbolsPerDay += 8;
    }

    if(this.ranheimDefense) {
      symbolsPerDay += 6;
    }

    return symbolsPerDay;
  }

  valueChanged() {
    this.valueChange.emit();
  }
}