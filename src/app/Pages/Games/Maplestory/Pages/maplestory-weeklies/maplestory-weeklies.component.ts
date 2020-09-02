import { Component, OnInit, OnDestroy } from '@angular/core';
import WeekliesJson from '../../../../../../assets/Games/Maplestory/Weeklies.json';
import { Weeklies } from '../../Models/weeklies';
import { Task } from '../../Models/task';
import { Region } from '../../Models/region';


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

  regions: Array<Region> = [
    { resetHour: 0, name: 'GMS' },
    { resetHour: 16, name: 'MSEA' },
    { resetHour: 15, name: 'KMS' }
  ];
  selectedRegionIndex: number = 16;
  resetHour: number = 0;

  characterIndex: number = 0;
  weeklies: Weeklies[] = [];
  editModeActive: boolean = false;
  editButtonMessage: string = "Edit Weeklies";

  constructor() { }

  ngOnInit() {
    this.initialise();
  }

  ngOnDestroy() {
    if (this.timerWeeklyBosses) {
      clearInterval(this.timerWeeklyBosses);
    }
    if (this.timerWeeklyTasks) {
      clearInterval(this.timerWeeklyTasks);
    }
  }

  initialise() {
    if (localStorage.getItem("mapleRegion")) {
      this.selectedRegionIndex = JSON.parse(localStorage.getItem("mapleRegion"));
      this.resetHour = this.regions[this.selectedRegionIndex].resetHour;
    }

    if (localStorage.getItem("weeklies")) {
      this.weeklies = JSON.parse(localStorage.getItem("weeklies"));
      this.weeklyBossDataChecker();
      this.weeklyTaskDataChecker();
      this.updateChecker();
      // set last visit
      localStorage.setItem("lastMapleWeeklyTrackerVisit", Date.now().toString());
    } else {
      // initiate a dataset
      this.initiateData();
      // set last visit 
      localStorage.setItem("lastMapleWeeklyTrackerVisit", Date.now().toString());
    }
    this.startWeeklyBossesTimer();
    this.startWeeklyTasksTimer();
  }

  initiateData() {
    var newWeekliesList: Weeklies = {
      characterName: "",
      weeklyBosses: WeekliesJson.weeklyBosses,
      weeklyTasks: WeekliesJson.weeklyTasks
    };

    for (let i = 0; i < 4; i++) {
      newWeekliesList.characterName = "Char" + (i + 1);
      this.weeklies[i] = JSON.parse(JSON.stringify(newWeekliesList));
    }

    localStorage.setItem("weekliesVersion", WeekliesJson.version);
    this.weekliesChangeHandler();
  }

  updateChecker() {
    // if the current version doesn't match the new version update the data
    if (localStorage.getItem("weekliesVersion") != WeekliesJson.version) {
      // copy the old weeklies into a var to save them for value transfering
      var oldWeeklies: Weeklies[] = JSON.parse(localStorage.getItem("weeklies"));
      // load in the new data structure into the weeklies var to transfer it to a newWeeklies array for verifying which weeklies need to be added or removed
      this.initiateData();
      var newWeekliesStructure: Weeklies[] = JSON.parse(JSON.stringify(this.weeklies));

      for (let i = 0; i < this.weeklies.length; i++) {
        // move over the name
        this.weeklies[i].characterName = oldWeeklies[i].characterName;

        // update weekly bosses
        this.weeklies[i].weeklyBosses = [];
        // copy over all data from weeklybosses that still exist in the new structure
        for (let j = 0; j < oldWeeklies[i].weeklyBosses.length; j++) {
          for (let k = 0; k < newWeekliesStructure[i].weeklyBosses.length; k++) {
            if (oldWeeklies[i].weeklyBosses[j].name == newWeekliesStructure[i].weeklyBosses[k].name) {
              // transfer the name, completed & enabled values from oldweeklies and image from the new structure into a temporary object
              var transferTask: Task = {
                name: oldWeeklies[i].weeklyBosses[j].name,
                image: newWeekliesStructure[i].weeklyBosses[k].image,
                completed: oldWeeklies[i].weeklyBosses[j].completed,
                enabled: oldWeeklies[i].weeklyBosses[j].enabled
              };
              // add this task to the current weekly bosses structure
              this.weeklies[i].weeklyBosses.push(transferTask);
              newWeekliesStructure[i].weeklyBosses.splice(k, 1);
            }
          }
        }
        // copy all left over new weeklybosses over
        for (let j = 0; j < newWeekliesStructure[i].weeklyBosses.length; j++) {
          var transferTask: Task = {
            name: newWeekliesStructure[i].weeklyBosses[j].name,
            image: newWeekliesStructure[i].weeklyBosses[j].image,
            completed: newWeekliesStructure[i].weeklyBosses[j].completed,
            enabled: newWeekliesStructure[i].weeklyBosses[j].enabled
          };
          this.weeklies[i].weeklyBosses.push(transferTask);
        }

        // update weekly tasks
        this.weeklies[i].weeklyTasks = [];
        // copy over all data from weeklytasks that still exist in the new structure
        for (let j = 0; j < oldWeeklies[i].weeklyTasks.length; j++) {
          for (let k = 0; k < newWeekliesStructure[i].weeklyTasks.length; k++) {
            if (oldWeeklies[i].weeklyTasks[j].name == newWeekliesStructure[i].weeklyTasks[k].name) {
              // transfer the name, completed & enabled values from oldweeklies and image from the new structure into a temporary object
              var transferTask: Task = {
                name: oldWeeklies[i].weeklyTasks[j].name,
                image: newWeekliesStructure[i].weeklyTasks[k].image,
                completed: oldWeeklies[i].weeklyTasks[j].completed,
                enabled: oldWeeklies[i].weeklyTasks[j].enabled
              };
              // add this task to the current weeklies structure
              this.weeklies[i].weeklyTasks.push(transferTask);
              newWeekliesStructure[i].weeklyTasks.splice(k, 1);
            }
          }
        }
        // copy all left over new weeklytasks over
        for (let j = 0; j < newWeekliesStructure[i].weeklyTasks.length; j++) {
          var transferTask: Task = {
            name: newWeekliesStructure[i].weeklyTasks[j].name,
            image: newWeekliesStructure[i].weeklyTasks[j].image,
            completed: newWeekliesStructure[i].weeklyTasks[j].completed,
            enabled: newWeekliesStructure[i].weeklyTasks[j].enabled
          };
          this.weeklies[i].weeklyTasks.push(transferTask);
        }

        // save the updated data
        this.weekliesChangeHandler();
        // update the saved version to the current one
        localStorage.setItem("weekliesVersion", WeekliesJson.version);
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

  regionChange(event: any) {
    this.selectedRegionIndex = event.target.selectedIndex;
    this.resetHour = this.regions[event.target.selectedIndex].resetHour;
    localStorage.setItem("mapleRegion", JSON.stringify(this.selectedRegionIndex));

    // re do the checks for previous day data & setup the timers for the new resetHour
    this.initialise();
  }

  weekliesChangeHandler() {
    localStorage.setItem("weeklies", JSON.stringify(this.weeklies));
  }

  changeCharacter(characterIndex: number) {
    this.characterIndex = characterIndex;
  }

  disableWeeklyBoss(taskIndex: number) {
    if (!this.editModeActive) {
      return;
    }

    if (this.weeklies[this.characterIndex].weeklyBosses[taskIndex].enabled) {
      this.weeklies[this.characterIndex].weeklyBosses[taskIndex].enabled = false;
    } else {
      this.weeklies[this.characterIndex].weeklyBosses[taskIndex].enabled = true;
    }
  }

  disableWeeklyTask(taskIndex: number) {
    if (!this.editModeActive) {
      return;
    }

    if (this.weeklies[this.characterIndex].weeklyTasks[taskIndex].enabled) {
      this.weeklies[this.characterIndex].weeklyTasks[taskIndex].enabled = false;
    } else {
      this.weeklies[this.characterIndex].weeklyTasks[taskIndex].enabled = true;
    }
  }

  toggleEditMode() {
    if (this.editModeActive) {
      this.editModeActive = false;
      this.editButtonMessage = "Edit Weekies";
      this.weekliesChangeHandler();
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
    this.weeklies.forEach(item => {
      item.weeklyBosses.forEach(item => {
        item.completed = false;
      });
    });
    this.weekliesChangeHandler();
  }

  resetWeeklyTasksCompletedValues() {
    this.weeklies.forEach(item => {
      item.weeklyTasks.forEach(item => {
        item.completed = false;
      });
    });
    this.weekliesChangeHandler();
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
    // if the timezone is ahead of UTC the next day of the week has to be the same as the current day there for a day is removed
    // this allows the calculation that sets the resultdate to the next occuring day to the same day
    // example: weekly boss reset wed -> thur on +8UTC resets on wednesday 16:00 UTC there for a day is removed so that the count down countsdown to wednesday at 16:00 and not thursday 16:00
    if(this.resetHour > 0) {
      if(dayOfWeek == 0) {
        dayOfWeek = 6;
      } else {
        dayOfWeek = dayOfWeek -1;
      }
    }

    var currentDay = new Date();
    var resultDate = new Date(Date.UTC(currentDay.getUTCFullYear(), currentDay.getUTCMonth(), currentDay.getUTCDate(), this.resetHour, 0, 0, 0));

    resultDate.setTime(resultDate.getTime() + (((7 + dayOfWeek - resultDate.getUTCDay() - 1) % 7 + 1) * 24 * 60 * 60 * 1000));

    return resultDate;
  }

  getPreviousDayOfWeek(dayOfWeek) {
    var resultDate = this.getNextDayOfWeek(dayOfWeek);
    resultDate.setTime(resultDate.getTime() - (24 * 60 * 60 * 1000 * 7));
    return resultDate;
  }

  moveWeeklyBoss(index: number, direction: string) {
    if (direction == "up") {
      if (index == 0) {
        return;
      }
      var temp = this.weeklies[this.characterIndex].weeklyBosses[index - 1];
      this.weeklies[this.characterIndex].weeklyBosses[index - 1] = this.weeklies[this.characterIndex].weeklyBosses[index];
      this.weeklies[this.characterIndex].weeklyBosses[index] = temp;
    }

    if (direction == "down") {
      if (index + 1 == this.weeklies[this.characterIndex].weeklyBosses.length) {
        return;
      }
      var temp = this.weeklies[this.characterIndex].weeklyBosses[index + 1];
      this.weeklies[this.characterIndex].weeklyBosses[index + 1] = this.weeklies[this.characterIndex].weeklyBosses[index];
      this.weeklies[this.characterIndex].weeklyBosses[index] = temp;
    }
  }

  moveWeeklyTask(index: number, direction: string) {
    if (direction == "up") {
      if (index == 0) {
        return;
      }
      var temp = this.weeklies[this.characterIndex].weeklyTasks[index - 1];
      this.weeklies[this.characterIndex].weeklyTasks[index - 1] = this.weeklies[this.characterIndex].weeklyTasks[index];
      this.weeklies[this.characterIndex].weeklyTasks[index] = temp;
    }

    if (direction == "down") {
      if (index + 1 == this.weeklies[this.characterIndex].weeklyTasks.length) {
        return;
      }
      var temp = this.weeklies[this.characterIndex].weeklyTasks[index + 1];
      this.weeklies[this.characterIndex].weeklyTasks[index + 1] = this.weeklies[this.characterIndex].weeklyTasks[index];
      this.weeklies[this.characterIndex].weeklyTasks[index] = temp;
    }
  }
}