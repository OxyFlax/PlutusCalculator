import { Component, OnInit, OnDestroy } from '@angular/core';
import DailiesJson from '../../../../../../assets/Games/Maplestory/Dailies.json';
import { Task } from '../../Models/task';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-maplestory-dailies',
  templateUrl: './maplestory-dailies.component.html',
  styleUrls: ['./maplestory-dailies.component.css']
})
export class MaplestoryDailiesComponent implements OnInit, OnDestroy {
  timer: any;
  timerString: string;

  editModeActive: boolean = false;
  dailyBosses: Task[];
  dailyTasks: Task[];
  dailyArcaneRiver: Task[];
  editButtonMessage: string = "Edit Dailies";

  constructor(private toastr: ToastrService) { }

  ngOnInit() {
    this.updateChecker();
    //this.checkForUpdate();
    this.dailyBosses = localStorage.getItem("dailyBosses") ? JSON.parse(localStorage.getItem("dailyBosses")) : DailiesJson.dailyBosses;
    this.dailyTasks = localStorage.getItem("dailyTasks") ? JSON.parse(localStorage.getItem("dailyTasks")) : DailiesJson.dailyTasks;
    this.dailyArcaneRiver = localStorage.getItem("dailyArcaneRiver") ? JSON.parse(localStorage.getItem("dailyArcaneRiver")) : DailiesJson.dailyArcaneRiver;
    this.startTimer();
    this.checkIfDataIsFromPreviousDay();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  updateChecker() {
    if (localStorage.getItem("dailiesVersion") != DailiesJson.version) {
      // check if daily boss data is present if so update it
      if (localStorage.getItem("dailyBosses")) {
        var oldDailyBosses: Task[] = JSON.parse(localStorage.getItem("dailyBosses"));
        this.dailyBosses = DailiesJson.dailyBosses;
        for (let i = 0; i < this.dailyBosses.length; i++) {
          for (let j = 0; j < oldDailyBosses.length; j++) {
            if (this.dailyBosses[i].name == oldDailyBosses[j].name) {
              this.dailyBosses[i].completed = oldDailyBosses[j].completed;
              this.dailyBosses[i].enabled = oldDailyBosses[j].enabled;
              // remove the matched item to prevent unneeded iterations in the future
              oldDailyBosses.splice(j, 1);
              // if an old item was matched with a new item exit for loop to prevent unneeded iterations
              break;
            }
          }
        }
        // update the stored daily boss data
        this.dailyBossChangeHandler();
      }

      // check if daily task data is present if so update it
      if (localStorage.getItem("dailyTasks")) {
        var oldDailyTasks: Task[] = JSON.parse(localStorage.getItem("dailyTasks"));
        this.dailyTasks = DailiesJson.dailyTasks;
        for (let i = 0; i < this.dailyTasks.length; i++) {
          for (let j = 0; j < oldDailyTasks.length; j++) {
            if (this.dailyTasks[i].name == oldDailyTasks[j].name) {
              this.dailyTasks[i].completed = oldDailyTasks[j].completed;
              this.dailyTasks[i].enabled = oldDailyTasks[j].enabled;
              // remove the matched item to prevent unneeded iterations in the future
              oldDailyTasks.splice(j, 1);
              // if an old item was matched with a new item exit for loop to prevent unneeded iterations
              break;
            }
          }
        }
        // update the stored daily task data
        this.dailyTaskChangeHandler();
      }

      // check if daily arcane river data is present if so update it
      if (localStorage.getItem("dailyArcaneRiver")) {
        var oldDailyArcaneRiver: Task[] = JSON.parse(localStorage.getItem("dailyArcaneRiver"));
        this.dailyArcaneRiver = DailiesJson.dailyArcaneRiver;
        for (let i = 0; i < this.dailyArcaneRiver.length; i++) {
          for (let j = 0; j < oldDailyArcaneRiver.length; j++) {
            if (this.dailyArcaneRiver[i].name == oldDailyArcaneRiver[j].name) {
              this.dailyArcaneRiver[i].completed = oldDailyArcaneRiver[j].completed;
              this.dailyArcaneRiver[i].enabled = oldDailyArcaneRiver[j].enabled;
              // remove the matched item to prevent unneeded iterations in the future
              oldDailyArcaneRiver.splice(j, 1);
              // if an old item was matched with a new item exit for loop to prevent unneeded iterations
              break;
            }
          }
        }
        // update the stored daily arcane river data
        this.dailyArcaneRiverChangeHandler();
      }

      // update the saved version to the current one
      localStorage.setItem("dailiesVersion", DailiesJson.version);
      // notify the user of the changes
      this.toastr.success('An update for the daily tracker has been applied', '', { closeButton: true, timeOut: 10000, positionClass: 'toast-top-center' });
    }
  }

  checkForUpdate() {
    if(localStorage.getItem("dailiesVersion")) {
      if(localStorage.getItem("dailiesVersion") == DailiesJson.version) {
        // if the current version is the same nothing needs to happen
        return;
      } else {
        if(!localStorage.getItem("dailyBosses") && !localStorage.getItem("dailyTasks") && !localStorage.getItem("dailyArcaneRiver")) {
          // if there is no pre existing daily data there is no need for a reset
          localStorage.setItem("dailiesVersion", DailiesJson.version);
        } else {
        // update the version and remove stored daily data
        localStorage.setItem("dailiesVersion", DailiesJson.version);
        localStorage.removeItem("dailyBosses");
        localStorage.removeItem("dailyTasks");
        localStorage.removeItem("dailyArcaneRiver");

        // notify the user of the change
        this.toastr.warning('An update for the daily tracker has been applied', '', { closeButton: true, timeOut: 10000, progressBar: true, positionClass: 'toast-top-center'});
        }
      }
    } else {
      if(!localStorage.getItem("dailyBosses") && !localStorage.getItem("dailyTasks") && !localStorage.getItem("dailyArcaneRiver")) {
        // if there is no pre existing daily data there is no need for a reset
        localStorage.setItem("dailiesVersion", DailiesJson.version);
      } else {
        // if no version is found save the version and remove stored daily data
        localStorage.setItem("dailiesVersion", DailiesJson.version);
        localStorage.removeItem("dailyBosses");
        localStorage.removeItem("dailyTasks");
        localStorage.removeItem("dailyArcaneRiver");

        // notify the user of the change
        this.toastr.warning('An update for the daily tracker has been applied', '', { closeButton: true, timeOut: 10000, progressBar: true, positionClass: 'toast-top-center'});
      }
    }
  }

  checkIfDataIsFromPreviousDay() {
    var date = new Date();
    var currentUtcDay = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0);

    var lastVisit = localStorage.getItem("lastMapleDailyTrackerVisit") ? localStorage.getItem("lastMapleDailyTrackerVisit") : 0;

    if (lastVisit < currentUtcDay) {
      this.resetCompletedValues();
    }

    // reset last visit to the current time
    localStorage.setItem("lastMapleDailyTrackerVisit", Date.now().toString());
  }


  dailyBossChangeHandler() {
    localStorage.setItem("dailyBosses", JSON.stringify(this.dailyBosses));
  }

  dailyTaskChangeHandler() {
    localStorage.setItem("dailyTasks", JSON.stringify(this.dailyTasks));
  }

  dailyArcaneRiverChangeHandler() {
    localStorage.setItem("dailyArcaneRiver", JSON.stringify(this.dailyArcaneRiver));
  }

  disableDailyBoss(event: any, taskIndex: number) {
    event.preventDefault();
    if (!this.editModeActive) {
      return;
    }

    if (this.dailyBosses[taskIndex].enabled) {
      this.dailyBosses[taskIndex].enabled = false;
    } else {
      this.dailyBosses[taskIndex].enabled = true;
    }

    localStorage.setItem("dailyBosses", JSON.stringify(this.dailyBosses));
  }

  disableDailyTask(event: any, taskIndex: number) {
    event.preventDefault();
    if (!this.editModeActive) {
      return;
    }

    if (this.dailyTasks[taskIndex].enabled) {
      this.dailyTasks[taskIndex].enabled = false;
    } else {
      this.dailyTasks[taskIndex].enabled = true;
    }

    localStorage.setItem("dailyTasks", JSON.stringify(this.dailyTasks));
  }

  disableDailyArcaneRiver(event: any, taskIndex: number) {
    event.preventDefault();
    if (!this.editModeActive) {
      return;
    }

    if (this.dailyArcaneRiver[taskIndex].enabled) {
      this.dailyArcaneRiver[taskIndex].enabled = false;
    } else {
      this.dailyArcaneRiver[taskIndex].enabled = true;
    }

    localStorage.setItem("dailyArcaneRiver", JSON.stringify(this.dailyArcaneRiver));
  }

  toggleEditMode() {
    if (this.editModeActive) {
      this.editModeActive = false;
      this.editButtonMessage = "Edit Dailies";
    } else {
      this.editModeActive = true;
      this.editButtonMessage = "Exit Edit Mode";
    }
  }

  startTimer() {
    clearInterval(this.timer);

    var date = new Date();
    var endTime = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 0, 0, 0, 0);
    this.calculateAndOutPutTime(endTime - new Date().getTime());

    this.timer = setInterval(() => {
      var distance = endTime - new Date().getTime();
      this.calculateAndOutPutTime(distance);

      if (distance < 0) {
        clearInterval(this.timer);
        this.liveReset();
      }
    }, 1000);
  }

  calculateAndOutPutTime(distance: number) {
    if (distance < 0) {
      this.timerString = "RESET!";
      return;
    }

    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.timerString = hours + "h " + minutes + "m " + ("00" + seconds).slice(-2) + "s ";
  }

  resetCompletedValues() {
    this.dailyBosses.forEach(item => {
      item.completed = false;
    });
    this.dailyBossChangeHandler();

    this.dailyTasks.forEach(item => {
      item.completed = false;
    });
    this.dailyTaskChangeHandler();

    this.dailyArcaneRiver.forEach(item => {
      item.completed = false;
    });
    this.dailyArcaneRiverChangeHandler();
  }

  liveReset() {
    this.resetCompletedValues();
    this.startTimer();
    localStorage.setItem("lastMapleDailyTrackerVisit", (parseInt(Date.now().toString()) + 5000).toString());
  }
}