import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-morass',
  templateUrl: './morass.component.html',
  styleUrls: ['./morass.component.css']
})
export class MorassComponent implements OnInit{
  @Output() valueChange = new EventEmitter();
  dailyQuest: boolean = true;

  ngOnInit() {
    var dailyQuestStoredValue: number;
    dailyQuestStoredValue = localStorage.getItem("morassdailyquest") ?  + localStorage.getItem("morassdailyquest") : 1;
    this.dailyQuest = !!dailyQuestStoredValue; 
  }

  dailyQuestChangeHandler(){
    if(this.dailyQuest) {
      localStorage.setItem("morassdailyquest", "1");
    } else {
      localStorage.setItem("morassdailyquest", "0");
    }
    this.valueChanged();
  }

  public calculateDailySymbols(): number {
    var symbolsPerDay: number = 0;

    if (this.dailyQuest) {
      symbolsPerDay += 8;
    }

    return symbolsPerDay;
  }

  valueChanged() {
    this.valueChange.emit();
  }
}