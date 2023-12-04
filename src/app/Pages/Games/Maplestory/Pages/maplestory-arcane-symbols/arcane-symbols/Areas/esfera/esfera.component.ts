import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-esfera',
  templateUrl: './esfera.component.html',
  styleUrls: ['./esfera.component.css']
})
export class EsferaComponent implements OnInit{
  @Output() valueChange = new EventEmitter();
  dailyQuest: boolean = true;
  esferaGuardian: boolean = true;

  ngOnInit() {
  }

  public calculateDailySymbols(): number {
    var dailySymbols: number = 0;

    if (this.dailyQuest) {
      dailySymbols += 20;
    }

    // this is a weekly so divide the number by seven for daily average
    if (this.esferaGuardian) {
      dailySymbols += 45/7;
    }

    return dailySymbols;
  }

  valueChanged() {
    this.valueChange.emit();
  }
}