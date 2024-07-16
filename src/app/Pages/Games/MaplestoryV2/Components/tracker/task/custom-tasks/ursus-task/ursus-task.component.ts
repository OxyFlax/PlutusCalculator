import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Task } from '../../../../Models/taskModels';


@Component({
  selector: 'app-ursus-task',
  templateUrl: './ursus-task.component.html',
  styleUrls: ['./ursus-task.component.css']
})
export class UrsusTaskComponent implements OnInit, OnDestroy{
  @Input() task: Task;
  @Input() editModeActive: boolean;
  @Input() title: string;
  @Input() index: number;
  @Input() resetUtcOffset: number = 0;
  @Input() imagePrefix: string;

  @Output() disableEvent = new EventEmitter<any>();
  @Output() moveEvent = new EventEmitter<any>();
  @Output() changeEvent = new EventEmitter<any>();

  ursusTimer: any;
  ursusTimerString: string;
  ursusTimerPrefix: string;

  ngOnInit() {
    this.startUrsusTimer();
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

  startUrsusTimer() {
    clearInterval(this.ursusTimer);
    var endTime = this.determineUrsusEndTime();

    this.calculateAndOutPutUrsusTime(endTime - new Date().getTime());

    this.ursusTimer = setInterval(() => {
      var distance = endTime - new Date().getTime();
      this.calculateAndOutPutUrsusTime(distance);

      if (distance < 0) {
        clearInterval(this.ursusTimer);
        this.startUrsusTimer();
      }
    }, 1000);
  }

  determineUrsusEndTime(): number {
    var date = new Date();

    var slotOneStartTime = 1;
    var slotOneEndTime = 3;
    var slotTwoStartTime = 18;
    var slotTwoEndTime = 20;

    // since destiny the end times are now 4hour slots instead of the 2h slots thus the end times are different
      slotOneEndTime = 5;
      slotTwoEndTime = 22;

    // this used to adjust the endtimes during the Neo event (the timeslot is two hours longer until the 24th of August 2021 11:59PM UTC)
    // if its past this date the times are no longer adjusted
    // this is left for reference for future ursus end time changes during events
    // if (date.getTime() < 1661903999000) {
    //   slotOneEndTime = 5;
    //   slotTwoEndTime = 22;
    // }

    if (date.getUTCHours() < slotOneStartTime) {
      // count down to ursus slot 1 start which is the current day at 1am
      this.ursusTimerPrefix = "Golden Time in ";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), slotOneStartTime, 0, 0, 0);
    }

    if (date.getUTCHours() >= slotOneStartTime && date.getUTCHours() < slotOneEndTime) {
      // count down to ursus slot 1 ending
      this.ursusTimerPrefix = "Golden Time ending in";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), slotOneEndTime, 0, 0, 0);
    }

    if (date.getUTCHours() >= slotOneEndTime && date.getUTCHours() < slotTwoStartTime) {
      // count down to ursus slot 2 start
      this.ursusTimerPrefix = "Golden Time in";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), slotTwoStartTime, 0, 0, 0);
    }

    if (date.getUTCHours() >= slotTwoStartTime && date.getUTCHours() < slotTwoEndTime) {
      // count down to ursus slot 2 ending
      this.ursusTimerPrefix = "Golden Time ending in";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), slotTwoEndTime, 0, 0, 0);
    }

    if (date.getUTCHours() >= slotTwoEndTime) {
      // count down to ursus slot 1 start which is next utc day at 1am
      this.ursusTimerPrefix = "Golden Time in ";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, slotOneStartTime, 0, 0, 0);
    }
  }

  calculateAndOutPutUrsusTime(distance: number) {
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.ursusTimerString = hours + "h " + minutes + "m " + ("00" + seconds).slice(-2) + "s ";
  }
}
