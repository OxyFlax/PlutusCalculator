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
