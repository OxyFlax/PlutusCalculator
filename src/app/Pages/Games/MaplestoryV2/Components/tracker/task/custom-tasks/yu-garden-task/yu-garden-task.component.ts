import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Task } from '../../../../Models/taskModels';


@Component({
  selector: 'app-yu-garden-task',
  templateUrl: './yu-garden-task.component.html',
  styleUrls: ['./yu-garden-task.component.css']
})
export class YuGardenTaskComponent implements OnInit, OnDestroy{
  @Input() task: Task;
  @Input() editModeActive: boolean;
  @Input() title: string;
  @Input() index: number;
  @Input() resetUtcOffset: number = 0;
  @Input() imagePrefix: string;

  @Output() disableEvent = new EventEmitter<any>();
  @Output() moveEvent = new EventEmitter<any>();
  @Output() changeEvent = new EventEmitter<any>();

  yuGardenTimer: any;
  yuGardenTimerString: string;
  yuGardenTimerPrefix: string;

  ngOnInit() {
    this.startYuGardenTimer();
  }

  ngOnDestroy() {

  }

  disableTask() {
    // don't emit the event if editmode isn't active
    if (this.editModeActive) {
      this.disableEvent.emit(this.index);
    }
  }

  moveTask(direction: string) {
    this.moveEvent.emit({ index: this.index, direction: direction });
  }

  changeHandler() {
    this.changeEvent.emit();
  }

  evaluateDisplayCondition(condition: string) {
    try {
      return eval(condition);
    } catch (e) {
      return true;
    }
  }

  startYuGardenTimer() {
    clearInterval(this.yuGardenTimer);
    var endTime = this.determineYuGardenEndTime();

    this.calculateAndOutPutYuGardenTime(endTime - new Date().getTime());

    this.yuGardenTimer = setInterval(() => {
      var distance = endTime - new Date().getTime();
      this.calculateAndOutPutYuGardenTime(distance);

      if (distance < 0) {
        clearInterval(this.yuGardenTimer);
        this.startYuGardenTimer();
      }
    }, 1000);
  }

  determineYuGardenEndTime(): number {
    var date = new Date();

    var startTime = 18;
    var endTime = 2;

    if (date.getUTCHours() < endTime) {
      // count down to yu garden end which is the same day at 2AM
      this.yuGardenTimerPrefix = "Merchant leaves in ";
      console.log(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), endTime, 0, 0, 0));
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), endTime, 0, 0, 0);
    }

    if (date.getUTCHours() >= endTime && date.getUTCHours() < startTime) {
      // count down to yu garden start which is the current day at 6PM and after 2AM
      this.yuGardenTimerPrefix = "Merchant arrives in  ";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), startTime, 0, 0, 0);
    }

    if (date.getUTCHours() >= startTime) {
      // count down to yu garden end which is the next day at 2AM
      this.yuGardenTimerPrefix = "Merchant leaves in ";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, endTime, 0, 0, 0);
    }
  }

  calculateAndOutPutYuGardenTime(distance: number) {
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.yuGardenTimerString = hours + "h " + minutes + "m " + ("00" + seconds).slice(-2) + "s ";
  }
}
