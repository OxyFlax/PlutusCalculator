import { Component, OnInit, OnDestroy } from '@angular/core';
import DailiesJson from '../../../../../../assets/Games/Maplestory/Dailies.json';
import { Dailies } from '../../Models/dailies';

@Component({
  selector: 'app-maplestory-dailies',
  templateUrl: './maplestory-dailies.component.html',
  styleUrls: ['./maplestory-dailies.component.css']
})
export class MaplestoryDailiesComponent implements OnInit, OnDestroy {
  timer: any;
  timerString: string;
  ursusTimer: any;
  ursusTimerString: string;
  ursusTimerPrefix: string;

  characterIndex: number = 0;
  editModeActive: boolean = false;
  dailies: Dailies[] = [];
  editButtonMessage: string = "Edit Dailies";

  constructor() { }

  ngOnInit() {
    this.initialise();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  initialise() {
    if (localStorage.getItem("dailies")) {
      this.dailies = JSON.parse(localStorage.getItem("dailies"));
      this.checkIfDataIsFromPreviousDay();
      this.updateChecker();
    } else {
      // initiate a dataset
      this.initiateData();
      // set last visit 
      localStorage.setItem("lastMapleDailyTrackerVisit", Date.now().toString());
    }
    this.startTimer();
    this.startUrsusTimer();
  }

  initiateData() {
    var newDailiesList: Dailies = {
      characterName: "",
      dailyBosses: DailiesJson.dailyBosses,
      dailyTasks: DailiesJson.dailyTasks,
      dailyArcaneRiver: DailiesJson.dailyArcaneRiver
    };

    for (let i = 0; i < 4; i++) {
      newDailiesList.characterName = "Char" + (i + 1);
      this.dailies[i] = JSON.parse(JSON.stringify(newDailiesList));
    }

    localStorage.setItem("dailiesVersion", DailiesJson.version);
    this.dailiesChangeHandler();
  }

  updateChecker() {
    // if the current version doesn't match the new version update the data
    if (localStorage.getItem("dailiesVersion") != DailiesJson.version) {
      var oldDailies: Dailies[] = JSON.parse(localStorage.getItem("dailies"));
      // set the data to the new structure
      this.initiateData();
      for (let i = 0; i < this.dailies.length; i++) {
        // move over the name
        this.dailies[i].characterName = oldDailies[i].characterName;

        // update daily boss data
        for (let j = 0; j < this.dailies[i].dailyBosses.length; j++) {
          for (let k = 0; k < oldDailies[i].dailyBosses.length; k++) {
            if (this.dailies[i].dailyBosses[j].name == oldDailies[i].dailyBosses[k].name) {
              this.dailies[i].dailyBosses[j].completed = oldDailies[i].dailyBosses[k].completed;
              this.dailies[i].dailyBosses[j].enabled = oldDailies[i].dailyBosses[k].enabled;
              oldDailies[i].dailyBosses.splice(k, 1);
            }
          }
        }

        // update daily task data
        for (let j = 0; j < this.dailies[i].dailyTasks.length; j++) {
          for (let k = 0; k < oldDailies[i].dailyTasks.length; k++) {
            if (this.dailies[i].dailyTasks[j].name == oldDailies[i].dailyTasks[k].name) {
              this.dailies[i].dailyTasks[j].completed = oldDailies[i].dailyTasks[k].completed;
              this.dailies[i].dailyTasks[j].enabled = oldDailies[i].dailyTasks[k].enabled;
              oldDailies[i].dailyTasks.splice(k, 1);
            }
          }
        }

        // update daily arcane river data
        for (let j = 0; j < this.dailies[i].dailyArcaneRiver.length; j++) {
          for (let k = 0; k < oldDailies[i].dailyArcaneRiver.length; k++) {
            if (this.dailies[i].dailyArcaneRiver[j].name == oldDailies[i].dailyArcaneRiver[k].name) {
              this.dailies[i].dailyArcaneRiver[j].completed = oldDailies[i].dailyArcaneRiver[k].completed;
              this.dailies[i].dailyArcaneRiver[j].enabled = oldDailies[i].dailyArcaneRiver[k].enabled;
              oldDailies[i].dailyArcaneRiver.splice(k, 1);
            }
          }
        }
      }
      // save the updated data
      this.dailiesChangeHandler();
      // update the saved version to the current one
      localStorage.setItem("dailiesVersion", DailiesJson.version);
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

  dailiesChangeHandler() {
    localStorage.setItem("dailies", JSON.stringify(this.dailies));
  }

  changeCharacter(characterIndex: number) {
    this.characterIndex = characterIndex;
  }

  disableDailyBoss(event: any, taskIndex: number) {
    event.preventDefault();
    if (!this.editModeActive) {
      return;
    }

    if (this.dailies[this.characterIndex].dailyBosses[taskIndex].enabled) {
      this.dailies[this.characterIndex].dailyBosses[taskIndex].enabled = false;
    } else {
      this.dailies[this.characterIndex].dailyBosses[taskIndex].enabled = true;
    }
  }

  disableDailyTask(event: any, taskIndex: number) {
    event.preventDefault();
    if (!this.editModeActive) {
      return;
    }

    if (this.dailies[this.characterIndex].dailyTasks[taskIndex].enabled) {
      this.dailies[this.characterIndex].dailyTasks[taskIndex].enabled = false;
    } else {
      this.dailies[this.characterIndex].dailyTasks[taskIndex].enabled = true;
    }
  }

  disableDailyArcaneRiver(event: any, taskIndex: number) {
    event.preventDefault();
    if (!this.editModeActive) {
      return;
    }

    if (this.dailies[this.characterIndex].dailyArcaneRiver[taskIndex].enabled) {
      this.dailies[this.characterIndex].dailyArcaneRiver[taskIndex].enabled = false;
    } else {
      this.dailies[this.characterIndex].dailyArcaneRiver[taskIndex].enabled = true;
    }
  }

  toggleEditMode() {
    if (this.editModeActive) {
      this.editModeActive = false;
      this.editButtonMessage = "Edit Dailies";
      this.dailiesChangeHandler();
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

  startUrsusTimer() {
    clearInterval(this.ursusTimer);
    var endTime = this.determineUrsusEndTime();

    this.calculateAndOutPutUrsusTime(endTime - new Date().getTime());

    this.ursusTimer = setInterval(() => {
      var distance = endTime - new Date().getTime();
      this.calculateAndOutPutUrsusTime(distance);

      if (distance < 0) {
        clearInterval(this.timer);
        this.startUrsusTimer();
      }
    }, 1000);
  }

  determineUrsusEndTime() : number {
    var date = new Date();

    if(date.getUTCHours() < 1) {
      // count down to ursus slot 1 start which is the current day at 1am
      this.ursusTimerPrefix = "Golden Time in ";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 1, 0, 0, 0);
    }

    if(date.getUTCHours() >= 1 && date.getUTCHours() < 3) {
      // count down to ursus slot 1 ending
      this.ursusTimerPrefix = "Golden Time ending in";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 3, 0, 0, 0);
    }

    if(date.getUTCHours() >= 3 && date.getUTCHours() < 18) {
      // count down to ursus slot 2 start
      this.ursusTimerPrefix = "Golden Time in";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 18, 0, 0, 0);
    }

    if(date.getUTCHours() >= 18 && date.getUTCHours() < 20) {
      // count down to ursus slot 2 ending
      this.ursusTimerPrefix = "Golden Time ending in";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 20, 0, 0, 0);
    }

    if(date.getUTCHours() >= 20) {
      // count down to ursus slot 1 start which is next utc day at 1am
      this.ursusTimerPrefix = "Golden Time in ";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 1, 0, 0, 0);
    }
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

  calculateAndOutPutUrsusTime(distance: number) {
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.ursusTimerString = hours + "h " + minutes + "m " + ("00" + seconds).slice(-2) + "s ";
  }

  resetCompletedValues() {
    this.dailies.forEach(item => {
      item.dailyBosses.forEach(item => {
        item.completed = false;
      });
      item.dailyTasks.forEach(item => {
        item.completed = false;
      });
      item.dailyArcaneRiver.forEach(item => {
        item.completed = false;
      });
    });
    this.dailiesChangeHandler();
  }

  liveReset() {
    this.resetCompletedValues();
    this.startTimer();
    localStorage.setItem("lastMapleDailyTrackerVisit", (parseInt(Date.now().toString()) + 5000).toString());
  }

  moveDailyBoss(index: number, direction: string){
    if(direction == "up") {
      if(index == 0) {
        return;
      }
      var temp = this.dailies[this.characterIndex].dailyBosses[index - 1];
      this.dailies[this.characterIndex].dailyBosses[index - 1] = this.dailies[this.characterIndex].dailyBosses[index];
      this.dailies[this.characterIndex].dailyBosses[index] = temp;
    }

    if(direction == "down") {
      if(index + 1 == this.dailies[this.characterIndex].dailyBosses.length){
        return;
      }
      var temp = this.dailies[this.characterIndex].dailyBosses[index + 1];
      this.dailies[this.characterIndex].dailyBosses[index + 1] = this.dailies[this.characterIndex].dailyBosses[index];
      this.dailies[this.characterIndex].dailyBosses[index] = temp;
    }
  }

  moveDailyTask(index: number, direction: string){
    if(direction == "up") {
      if(index == 0) {
        return;
      }
      var temp = this.dailies[this.characterIndex].dailyTasks[index - 1];
      this.dailies[this.characterIndex].dailyTasks[index - 1] = this.dailies[this.characterIndex].dailyTasks[index];
      this.dailies[this.characterIndex].dailyTasks[index] = temp;
    }

    if(direction == "down") {
      if(index + 1 == this.dailies[this.characterIndex].dailyTasks.length){
        return;
      }
      var temp = this.dailies[this.characterIndex].dailyTasks[index + 1];
      this.dailies[this.characterIndex].dailyTasks[index + 1] = this.dailies[this.characterIndex].dailyTasks[index];
      this.dailies[this.characterIndex].dailyTasks[index] = temp;
    }
  }

  moveDailyArcaneRiver(index: number, direction: string){
    if(direction == "up") {
      if(index == 0) {
        return;
      }
      var temp = this.dailies[this.characterIndex].dailyArcaneRiver[index - 1];
      this.dailies[this.characterIndex].dailyArcaneRiver[index - 1] = this.dailies[this.characterIndex].dailyArcaneRiver[index];
      this.dailies[this.characterIndex].dailyArcaneRiver[index] = temp;
    }

    if(direction == "down") {
      if(index + 1 == this.dailies[this.characterIndex].dailyArcaneRiver.length){
        return;
      }
      var temp = this.dailies[this.characterIndex].dailyArcaneRiver[index + 1];
      this.dailies[this.characterIndex].dailyArcaneRiver[index + 1] = this.dailies[this.characterIndex].dailyArcaneRiver[index];
      this.dailies[this.characterIndex].dailyArcaneRiver[index] = temp;
    }
  }
}