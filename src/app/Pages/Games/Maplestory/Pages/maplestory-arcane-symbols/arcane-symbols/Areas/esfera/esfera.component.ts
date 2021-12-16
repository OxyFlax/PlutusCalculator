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
    var symbolsPerDay: number = 0;

    if (this.dailyQuest) {
      symbolsPerDay += 8;
    }

    if(this.esferaGuardian) {
      symbolsPerDay += 6;
    }

    return symbolsPerDay;
  }

  valueChanged() {
    this.valueChange.emit();
  }
}