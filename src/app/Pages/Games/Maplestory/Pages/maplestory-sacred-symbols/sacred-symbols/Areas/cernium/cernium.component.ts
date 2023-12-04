import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cernium',
  templateUrl: './cernium.component.html',
  styleUrls: ['./cernium.component.css']
})
export class CerniumComponent implements OnInit {
  @Output() valueChange = new EventEmitter();
  cerniumDailyQuest: boolean = true;
  burningCerniumDailyQuest: boolean = true;

  ngOnInit() {
  }

  public calculateDailySymbols() {
    var dailySymbols: number = 0;

    if (this.cerniumDailyQuest) {
      dailySymbols += 20;
    }

    return dailySymbols;
  }

  valueChanged() {
    this.valueChange.emit();
  }
}
