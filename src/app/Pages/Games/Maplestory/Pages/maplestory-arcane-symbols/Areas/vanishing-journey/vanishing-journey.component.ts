import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-vanishing-journey',
  templateUrl: './vanishing-journey.component.html',
  styleUrls: ['./vanishing-journey.component.css']
})
export class VanishingJourneyComponent implements OnInit {
  @Output() valueChange = new EventEmitter();
  dailyQuest: boolean = true;
  erdaSpectrum: boolean = true;

  ngOnInit() {
    var dailyQuestStoredValue: number;
    dailyQuestStoredValue = localStorage.getItem("vjdailyquest") ? + localStorage.getItem("vjdailyquest") : 1;
    this.dailyQuest = !!dailyQuestStoredValue;

    var erdaSpectrumStoredValue: number;
    erdaSpectrumStoredValue = localStorage.getItem("erdaspectrum") ? + localStorage.getItem("erdaspectrum") : 1;
    this.erdaSpectrum = !!erdaSpectrumStoredValue;
  }

  dailyQuestChangeHandler() {
    if (this.dailyQuest) {
      localStorage.setItem("vjdailyquest", "1");
    } else {
      localStorage.setItem("vjdailyquest", "0");
    }
    this.valueChanged();
  }

  erdaSpectrumChangeHandler() {
    if (this.erdaSpectrum) {
      localStorage.setItem("erdaspectrum", "1");
    } else {
      localStorage.setItem("erdaspectrum", "0");
    }
    this.valueChanged();
  }

  public calculateDailySymbols() {
    var dailySymbols: number = 0;

    if (this.dailyQuest) {
      dailySymbols += 8;
    }

    if (this.erdaSpectrum) {
      dailySymbols += 6;
    }

    return dailySymbols;
  }

  valueChanged() {
    this.valueChange.emit();
  }
}
