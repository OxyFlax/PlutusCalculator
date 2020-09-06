import { Component, OnInit, OnDestroy } from '@angular/core';
import DailiesJson from '../../../../../../assets/Games/Maplestory/Dailies.json';
import { Dailies } from '../../Models/dailies';
import { Task } from '../../Models/task';
import { Region } from '../../Models/region';

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

  regions: Array<Region> = [
    { resetUtcOffset: 0, name: 'GMS' },
    { resetUtcOffset: 8, name: 'MSEA' },
    { resetUtcOffset: 9, name: 'KMS' }
  ];
  selectedRegionIndex: number = 0;
  resetUtcOffset: number = 0;

  characterIndex: number = 0;
  dailies: Dailies[] = [];
  editModeActive: boolean = false;
  editButtonMessage: string = "Edit Dailies";

  constructor() { }

  ngOnInit() {
    this.initialise();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    if (this.ursusTimer) {
      clearInterval(this.ursusTimer);
    }
  }

  initialise() {
    if (localStorage.getItem("mapleRegion")) {
      this.selectedRegionIndex = JSON.parse(localStorage.getItem("mapleRegion"));
      this.resetUtcOffset = this.regions[this.selectedRegionIndex].resetUtcOffset;
    }

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
    // ursus timer only has support for GMS so if reset isn't at 0 utc we don't need to start the timer
    if (this.resetUtcOffset == 0) {
      this.startUrsusTimer();
    }
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
      // copy the old dailies into a var to save them for value transfering
      var oldDailies: Dailies[] = JSON.parse(localStorage.getItem("dailies"));
      // load in the new data structure into the dailies var to transfer it to a newDailies array for verifying which dailies need to be added or removed
      this.initiateData();
      var newDailiesStructure: Dailies[] = JSON.parse(JSON.stringify(this.dailies));

      for (let i = 0; i < this.dailies.length; i++) {
        // move over the name
        this.dailies[i].characterName = oldDailies[i].characterName;

        // update daily bosses
        this.dailies[i].dailyBosses = [];
        // copy over all data from dailybosses that still exist in the new structure
        for (let j = 0; j < oldDailies[i].dailyBosses.length; j++) {
          for (let k = 0; k < newDailiesStructure[i].dailyBosses.length; k++) {
            if (oldDailies[i].dailyBosses[j].name == newDailiesStructure[i].dailyBosses[k].name) {
              // transfer the name, completed & enabled values from olddailies and image from the new structure into a temporary object
              var transferTask: Task = {
                name: oldDailies[i].dailyBosses[j].name,
                image: newDailiesStructure[i].dailyBosses[k].image,
                completed: oldDailies[i].dailyBosses[j].completed,
                enabled: oldDailies[i].dailyBosses[j].enabled
              };
              // add this task to the current dailies structure
              this.dailies[i].dailyBosses.push(transferTask);
              newDailiesStructure[i].dailyBosses.splice(k, 1);
            }
          }
        }
        // copy all left over new dailybosses over
        for (let j = 0; j < newDailiesStructure[i].dailyBosses.length; j++) {
          var transferTask: Task = {
            name: newDailiesStructure[i].dailyBosses[j].name,
            image: newDailiesStructure[i].dailyBosses[j].image,
            completed: newDailiesStructure[i].dailyBosses[j].completed,
            enabled: newDailiesStructure[i].dailyBosses[j].enabled
          };
          this.dailies[i].dailyBosses.push(transferTask);
        }

        // update daily tasks
        this.dailies[i].dailyTasks = [];
        // copy over all data from dailytasks that still exist in the new structure
        for (let j = 0; j < oldDailies[i].dailyTasks.length; j++) {
          for (let k = 0; k < newDailiesStructure[i].dailyTasks.length; k++) {
            if (oldDailies[i].dailyTasks[j].name == newDailiesStructure[i].dailyTasks[k].name) {
              // transfer the name, completed & enabled values from olddailies and image from the new structure into a temporary object
              var transferTask: Task = {
                name: oldDailies[i].dailyTasks[j].name,
                image: newDailiesStructure[i].dailyTasks[k].image,
                completed: oldDailies[i].dailyTasks[j].completed,
                enabled: oldDailies[i].dailyTasks[j].enabled
              };
              // add this task to the current dailies structure
              this.dailies[i].dailyTasks.push(transferTask);
              newDailiesStructure[i].dailyTasks.splice(k, 1);
            }
          }
        }
        // copy all left over new weeklytasks over
        for (let j = 0; j < newDailiesStructure[i].dailyTasks.length; j++) {
          var transferTask: Task = {
            name: newDailiesStructure[i].dailyTasks[j].name,
            image: newDailiesStructure[i].dailyTasks[j].image,
            completed: newDailiesStructure[i].dailyTasks[j].completed,
            enabled: newDailiesStructure[i].dailyTasks[j].enabled
          };
          this.dailies[i].dailyTasks.push(transferTask);
        }

        // update daily arcaneriver
        this.dailies[i].dailyArcaneRiver = [];
        // copy over all data from dailyarcaneriver that still exist in the new structure
        for (let j = 0; j < oldDailies[i].dailyArcaneRiver.length; j++) {
          for (let k = 0; k < newDailiesStructure[i].dailyArcaneRiver.length; k++) {
            if (oldDailies[i].dailyArcaneRiver[j].name == newDailiesStructure[i].dailyArcaneRiver[k].name) {
              // transfer the name, completed & enabled values from olddailies and image from the new structure into a temporary object
              var transferTask: Task = {
                name: oldDailies[i].dailyArcaneRiver[j].name,
                image: newDailiesStructure[i].dailyArcaneRiver[k].image,
                completed: oldDailies[i].dailyArcaneRiver[j].completed,
                enabled: oldDailies[i].dailyArcaneRiver[j].enabled
              };
              // add this task to the current dailies structure
              this.dailies[i].dailyArcaneRiver.push(transferTask);
              newDailiesStructure[i].dailyArcaneRiver.splice(k, 1);
            }
          }
        }
        // copy all left over new dailyarcaneriver over
        for (let j = 0; j < newDailiesStructure[i].dailyArcaneRiver.length; j++) {
          var transferTask: Task = {
            name: newDailiesStructure[i].dailyArcaneRiver[j].name,
            image: newDailiesStructure[i].dailyArcaneRiver[j].image,
            completed: newDailiesStructure[i].dailyArcaneRiver[j].completed,
            enabled: newDailiesStructure[i].dailyArcaneRiver[j].enabled
          };
          this.dailies[i].dailyArcaneRiver.push(transferTask);
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

    var lastReset = this.calculateResetTime() - (24 * 60 * 60 * 1000);

    var lastVisit = localStorage.getItem("lastMapleDailyTrackerVisit") ? localStorage.getItem("lastMapleDailyTrackerVisit") : 0;

    if (lastVisit < lastReset) {
      this.resetCompletedValues();
    }

    // reset last visit to the current time
    localStorage.setItem("lastMapleDailyTrackerVisit", Date.now().toString());
  }

  regionChange(event: any) {
    this.selectedRegionIndex = event.target.selectedIndex;
    this.resetUtcOffset = this.regions[event.target.selectedIndex].resetUtcOffset;
    localStorage.setItem("mapleRegion", JSON.stringify(this.selectedRegionIndex));

    // re do the checks for previous day data & setup the timers for the new resetUtcOffset
    this.initialise();
  }

  dailiesChangeHandler() {
    localStorage.setItem("dailies", JSON.stringify(this.dailies));
  }

  changeCharacter(characterIndex: number) {
    this.characterIndex = characterIndex;
  }

  disableDailyBoss(taskIndex: number) {
    if (!this.editModeActive) {
      return;
    }

    if (this.dailies[this.characterIndex].dailyBosses[taskIndex].enabled) {
      this.dailies[this.characterIndex].dailyBosses[taskIndex].enabled = false;
    } else {
      this.dailies[this.characterIndex].dailyBosses[taskIndex].enabled = true;
    }
  }

  disableDailyTask(taskIndex: number) {
    if (!this.editModeActive) {
      return;
    }

    if (this.dailies[this.characterIndex].dailyTasks[taskIndex].enabled) {
      this.dailies[this.characterIndex].dailyTasks[taskIndex].enabled = false;
    } else {
      this.dailies[this.characterIndex].dailyTasks[taskIndex].enabled = true;
    }
  }

  disableDailyArcaneRiver(taskIndex: number) {
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

    var endTime = this.calculateResetTime();

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

  determineUrsusEndTime(): number {
    var date = new Date();

    if (date.getUTCHours() < 1) {
      // count down to ursus slot 1 start which is the current day at 1am
      this.ursusTimerPrefix = "Golden Time in ";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 1, 0, 0, 0);
    }

    if (date.getUTCHours() >= 1 && date.getUTCHours() < 3) {
      // count down to ursus slot 1 ending
      this.ursusTimerPrefix = "Golden Time ending in";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 3, 0, 0, 0);
    }

    if (date.getUTCHours() >= 3 && date.getUTCHours() < 18) {
      // count down to ursus slot 2 start
      this.ursusTimerPrefix = "Golden Time in";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 18, 0, 0, 0);
    }

    if (date.getUTCHours() >= 18 && date.getUTCHours() < 20) {
      // count down to ursus slot 2 ending
      this.ursusTimerPrefix = "Golden Time ending in";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 20, 0, 0, 0);
    }

    if (date.getUTCHours() >= 20) {
      // count down to ursus slot 1 start which is next utc day at 1am
      this.ursusTimerPrefix = "Golden Time in ";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 1, 0, 0, 0);
    }
  }

  calculateResetTime(): number {
    var date = new Date();
    var endTime = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 0, 0, 0, 0);

    // calculate the offset from UTC if the time to countdown is in the past it means that a day needs to be added
    // WARNING: countdowns to timezones behind utc might not work properly (Have fun future me if this needs to be added :) )
    endTime = endTime - (this.resetUtcOffset * 60 * 60 * 1000)
    if(endTime < date.getTime()) {
      endTime += (24 * 60 * 60 * 1000);
    }

    return endTime;
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

  moveDailyBoss(index: number, direction: string) {
    if (direction == "up") {
      if (index == 0) {
        return;
      }
      var temp = this.dailies[this.characterIndex].dailyBosses[index - 1];
      this.dailies[this.characterIndex].dailyBosses[index - 1] = this.dailies[this.characterIndex].dailyBosses[index];
      this.dailies[this.characterIndex].dailyBosses[index] = temp;
    }

    if (direction == "down") {
      if (index + 1 == this.dailies[this.characterIndex].dailyBosses.length) {
        return;
      }
      var temp = this.dailies[this.characterIndex].dailyBosses[index + 1];
      this.dailies[this.characterIndex].dailyBosses[index + 1] = this.dailies[this.characterIndex].dailyBosses[index];
      this.dailies[this.characterIndex].dailyBosses[index] = temp;
    }
  }

  moveDailyTask(index: number, direction: string) {
    if (direction == "up") {
      if (index == 0) {
        return;
      }
      var temp = this.dailies[this.characterIndex].dailyTasks[index - 1];
      this.dailies[this.characterIndex].dailyTasks[index - 1] = this.dailies[this.characterIndex].dailyTasks[index];
      this.dailies[this.characterIndex].dailyTasks[index] = temp;
    }

    if (direction == "down") {
      if (index + 1 == this.dailies[this.characterIndex].dailyTasks.length) {
        return;
      }
      var temp = this.dailies[this.characterIndex].dailyTasks[index + 1];
      this.dailies[this.characterIndex].dailyTasks[index + 1] = this.dailies[this.characterIndex].dailyTasks[index];
      this.dailies[this.characterIndex].dailyTasks[index] = temp;
    }
  }

  moveDailyArcaneRiver(index: number, direction: string) {
    if (direction == "up") {
      if (index == 0) {
        return;
      }
      var temp = this.dailies[this.characterIndex].dailyArcaneRiver[index - 1];
      this.dailies[this.characterIndex].dailyArcaneRiver[index - 1] = this.dailies[this.characterIndex].dailyArcaneRiver[index];
      this.dailies[this.characterIndex].dailyArcaneRiver[index] = temp;
    }

    if (direction == "down") {
      if (index + 1 == this.dailies[this.characterIndex].dailyArcaneRiver.length) {
        return;
      }
      var temp = this.dailies[this.characterIndex].dailyArcaneRiver[index + 1];
      this.dailies[this.characterIndex].dailyArcaneRiver[index + 1] = this.dailies[this.characterIndex].dailyArcaneRiver[index];
      this.dailies[this.characterIndex].dailyArcaneRiver[index] = temp;
    }
  }
}