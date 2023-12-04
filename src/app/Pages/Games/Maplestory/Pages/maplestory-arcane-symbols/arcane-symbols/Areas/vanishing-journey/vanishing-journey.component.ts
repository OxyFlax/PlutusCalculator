import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-vanishing-journey',
  templateUrl: './vanishing-journey.component.html',
  styleUrls: ['./vanishing-journey.component.css']
})
export class VanishingJourneyComponent implements OnInit {
  @Output() valueChange = new EventEmitter();
  dailyQuest: boolean = true;
  reverseCity: boolean = false;
  erdaSpectrum: boolean = true;

  ngOnInit() {
  }

  public calculateDailySymbols() {
    var dailySymbols: number = 0;

    if (this.dailyQuest) {
      dailySymbols += 10;
    }

    // if reverse city is unlocked add an extra 9 symbols
    if (this.reverseCity) {
      dailySymbols += 10;
    }

    // this is a weekly so divide the number by seven for daily average
    if (this.erdaSpectrum) {
      dailySymbols += 45/7;
    }

    return dailySymbols;
  }

  valueChanged() {
    this.valueChange.emit();
  }
}
