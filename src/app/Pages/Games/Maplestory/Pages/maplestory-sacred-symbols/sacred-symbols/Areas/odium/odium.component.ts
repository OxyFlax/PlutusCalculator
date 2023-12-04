import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-odium',
  templateUrl: './odium.component.html',
  styleUrls: ['./odium.component.css']
})
export class OdiumComponent implements OnInit {
  @Output() valueChange = new EventEmitter();
  @Output() clearOutput = new EventEmitter();
  dailyQuest: boolean = true;

  ngOnInit() {
  }

  public calculateDailySymbols(): number {
    var symbolsPerDay: number = 0;

    if (this.dailyQuest) {
      symbolsPerDay += 10;
    }

    return symbolsPerDay;
  }

  valueChanged() {
    this.valueChange.emit();
  }

  emitClearOutput(){
    this.clearOutput.emit();
  }
}