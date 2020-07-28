import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-esfera',
  templateUrl: './esfera.component.html',
  styleUrls: ['./esfera.component.css']
})
export class EsferaComponent implements OnInit{
  @Output() valueChange = new EventEmitter();
  dailyQuest: boolean = true;

  ngOnInit() {
    var dailyQuestStoredValue: number;
    dailyQuestStoredValue = localStorage.getItem("esferadailyquest") ?  + localStorage.getItem("esferadailyquest") : 1;
    this.dailyQuest = !!dailyQuestStoredValue; 
  }

  dailyQuestChangeHandler(){
    if(this.dailyQuest) {
      localStorage.setItem("esferadailyquest", "1");
    } else {
      localStorage.setItem("esferadailyquest", "0");
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