import { Component, OnInit, OnDestroy } from '@angular/core';
import WeekliesJson from '../../../../../../assets/Games/Maplestory/Weeklies.json';
import { Task } from '../../Models/task';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-maplestory-weeklies',
  templateUrl: './maplestory-weeklies.component.html',
  styleUrls: ['./maplestory-weeklies.component.css']
})
export class MaplestoryWeekliesComponent implements OnInit, OnDestroy {
  timerWeeklyBosses: any;
  timerWeeklyTasks: any;
  timerWeeklyBossesString: string;
  timerWeeklyTasksString: string;

  editModeActive: boolean = false;
  weeklyBosses: Task[];
  weeklyTasks: Task[];
  editButtonMessage: string = "Edit Weeklies";

  constructor(private toastr: ToastrService) { }

  ngOnInit() {
    this.checkForUpdate();
    this.weeklyBosses = localStorage.getItem("weeklyBosses") ? JSON.parse(localStorage.getItem("weeklyBosses")) : WeekliesJson.weeklyBosses;
    this.weeklyTasks = localStorage.getItem("weeklyTasks") ? JSON.parse(localStorage.getItem("weeklyTasks")) : WeekliesJson.weeklyTasks;
    this.startWeeklyBossesTimer();
    this.startWeeklyTasksTimer();
    this.weeklyBossDataChecker();
    this.weeklyTaskDataChecker();
    localStorage.setItem("lastMapleWeeklyTrackerVisit", Date.now().toString());
  }

  ngOnDestroy() {
    if (this.timerWeeklyBosses) {
      clearInterval(this.timerWeeklyBosses);
    }
    if (this.timerWeeklyTasks) {
      clearInterval(this.timerWeeklyTasks);
    }
  }

  checkForUpdate() {
    if(localStorage.getItem("weekliesVersion")) {
      if(localStorage.getItem("weekliesVersion") == WeekliesJson.version) {
        // if the current version is the same nothing needs to happen
        return;
      } else {
        if(!localStorage.getItem("weeklyBosses") && !localStorage.getItem("weeklyTasks")) {
          // if there is no pre existing weekly data there is no need for a reset
          localStorage.setItem("weekliesVersion", WeekliesJson.version);
        } else {
          localStorage.setItem("weekliesVersion", WeekliesJson.version);
          localStorage.removeItem("weeklyBosses");
          localStorage.removeItem("weeklyTasks");
  
          // notify the user of the change
          this.toastr.warning('An update for the weekly tracker has been applied', '', { closeButton: true, timeOut: 10000, progressBar: true, positionClass: 'toast-top-center'});
        } 
      }
    } else {
      if(!localStorage.getItem("weeklyBosses") && !localStorage.getItem("weeklyTasks")) {
        // if there is no pre existing weekly data there is no need for a reset
        localStorage.setItem("weekliesVersion", WeekliesJson.version);
      } else {
        // if no version is found save the version and remove stored weekly data
        localStorage.setItem("weekliesVersion", WeekliesJson.version);
        localStorage.removeItem("weeklyBosses");
        localStorage.removeItem("weeklyTasks");

        // notify the user of the change
        this.toastr.warning('An update for the weekly tracker has been applied', '', { closeButton: true, timeOut: 10000, progressBar: true, positionClass: 'toast-top-center'});
      }
    }
  }

  weeklyBossDataChecker() {
    var lastThursday = this.getPreviousDayOfWeek(4);

    var lastVisit = localStorage.getItem("lastMapleWeeklyTrackerVisit") ? localStorage.getItem("lastMapleWeeklyTrackerVisit") : 0;

    if (lastVisit < lastThursday.valueOf()) {
      this.resetWeeklyBossesCompletedValues();
    }
  }

  weeklyTaskDataChecker() {
    var lastMonday = this.getPreviousDayOfWeek(1);

    var lastVisit = localStorage.getItem("lastMapleWeeklyTrackerVisit") ? localStorage.getItem("lastMapleWeeklyTrackerVisit") : 0;

    if (lastVisit < lastMonday.valueOf()) {
      this.resetWeeklyTasksCompletedValues();
    }
  }

  weeklyBossChangeHandler() {
    localStorage.setItem("weeklyBosses", JSON.stringify(this.weeklyBosses));
  }

  weeklyTaskChangeHandler() {
    localStorage.setItem("weeklyTasks", JSON.stringify(this.weeklyTasks));
  }

  disableWeeklyBoss(event: any, taskIndex: number) {
    event.preventDefault();
    if (!this.editModeActive) {
      return;
    }

    if (this.weeklyBosses[taskIndex].enabled) {
      this.weeklyBosses[taskIndex].enabled = false;
    } else {
      this.weeklyBosses[taskIndex].enabled = true;
    }

    localStorage.setItem("weeklyBosses", JSON.stringify(this.weeklyBosses));
  }

  disableWeeklyTask(event: any, taskIndex: number) {
    event.preventDefault();
    if (!this.editModeActive) {
      return;
    }

    if (this.weeklyTasks[taskIndex].enabled) {
      this.weeklyTasks[taskIndex].enabled = false;
    } else {
      this.weeklyTasks[taskIndex].enabled = true;
    }

    localStorage.setItem("weeklyTasks", JSON.stringify(this.weeklyTasks));
  }

  toggleEditMode() {
    if (this.editModeActive) {
      this.editModeActive = false;
      this.editButtonMessage = "Edit Weekies";
    } else {
      this.editModeActive = true;
      this.editButtonMessage = "Exit Edit Mode";
    }
  }

  startWeeklyBossesTimer() {
    clearInterval(this.timerWeeklyBosses);

    var endTime = this.getNextDayOfWeek(4).valueOf();
    this.calculateAndOutPutWeeklyBossesTime(endTime - new Date().getTime());

    this.timerWeeklyBosses = setInterval(() => {
      var distance = endTime - new Date().getTime();
      this.calculateAndOutPutWeeklyBossesTime(distance);

      if (distance < 0) {
        clearInterval(this.timerWeeklyBosses);
        this.liveResetWeeklyBosses();
      }
    }, 1000);
  }

  startWeeklyTasksTimer() {
    clearInterval(this.timerWeeklyTasks);

    var endTime = this.getNextDayOfWeek(1).valueOf();
    this.calculateAndOutPutWeeklyTasksTime(endTime - new Date().getTime());

    this.timerWeeklyTasks = setInterval(() => {
      var distance = endTime - new Date().getTime();
      this.calculateAndOutPutWeeklyTasksTime(distance);

      if (distance < 0) {
        clearInterval(this.timerWeeklyTasks);
        this.liveResetWeeklyTasks();
      }
    }, 1000);
  }

  calculateAndOutPutWeeklyBossesTime(distance: number) {
    if (distance < 0) {
      this.timerWeeklyBossesString = "RESET!";
      return;
    }

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.timerWeeklyBossesString = days + "d " + hours + "h " + minutes + "m " + ("00" + seconds).slice(-2) + "s ";
  }

  calculateAndOutPutWeeklyTasksTime(distance: number) {
    if (distance < 0) {
      this.timerWeeklyTasksString = "RESET!";
      return;
    }

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.timerWeeklyTasksString = days + "d " + hours + "h " + minutes + "m " + ("00" + seconds).slice(-2) + "s ";
  }

  resetWeeklyBossesCompletedValues() {
    this.weeklyBosses.forEach(item => {
      item.completed = false;
    });
    this.weeklyBossChangeHandler();
  }

  resetWeeklyTasksCompletedValues() {
    this.weeklyTasks.forEach(item => {
      item.completed = false;
    });
    this.weeklyTaskChangeHandler();
  }

  liveResetWeeklyBosses() {
    this.resetWeeklyBossesCompletedValues();

    this.startWeeklyBossesTimer();
    localStorage.setItem("lastMapleWeeklyTrackerVisit", (parseInt(Date.now().toString()) + 5000).toString());
  }

  liveResetWeeklyTasks() {
    this.resetWeeklyTasksCompletedValues();

    this.startWeeklyTasksTimer();
    localStorage.setItem("lastMapleWeeklyTrackerVisit", (parseInt(Date.now().toString()) + 5000).toString());
  }

  getNextDayOfWeek(dayOfWeek) {
    var currentDay = new Date();

    var resultDate = new Date(Date.UTC(currentDay.getUTCFullYear(), currentDay.getUTCMonth(), currentDay.getUTCDate(), 0, 0, 0, 0));

    resultDate.setDate(currentDay.getUTCDate() + (7 + dayOfWeek - currentDay.getUTCDay() - 1) % 7 + 1);

    return resultDate;
  }

  getPreviousDayOfWeek(dayOfWeek) {
    var resultDate = this.getNextDayOfWeek(dayOfWeek);
    resultDate.setDate(resultDate.getUTCDate() - 7);
    return resultDate;
  }
}
