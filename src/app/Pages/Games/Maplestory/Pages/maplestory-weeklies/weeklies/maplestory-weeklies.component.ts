import { Component, OnInit, OnDestroy } from '@angular/core';
import WeekliesJson from '../../../../../../../assets/Games/Maplestory/Weeklies.json';
import { Weeklies } from '../../../Models/weeklies';
import { Task } from '../../../Models/task';
import { Region } from '../../../Models/region';


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
    { resetUtcOffset: 0, name: 'GMS' },
    { resetUtcOffset: 8, name: 'MSEA' },
    { resetUtcOffset: 9, name: 'KMS' }
  ];
  selectedRegionIndex: number = 0;
  resetUtcOffset: number = 0;

  characterIndex: number = 0;
  weeklies: Weeklies[] = [];
  allWeeklyBossesDisabled: boolean = false;
  allWeeklyTasksDisabled: boolean = false;
  editModeActive: boolean = false;
  editButtonMessage: string = "Edit Weeklies";

  addingCustomWeekly: boolean = false;
  customWeeklyType: string = "";
  customWeeklyName: string = "";
  customWeeklyImageUrl: string = "";

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

    // handle the saving of things if the user leaves without exiting edit mode
    if (this.editModeActive) {
      this.toggleEditMode;
    }
  }

  initialise() {
    if (localStorage.getItem("mapleRegion")) {
      this.selectedRegionIndex = JSON.parse(localStorage.getItem("mapleRegion"));
      this.resetUtcOffset = this.regions[this.selectedRegionIndex].resetUtcOffset;
    }

    if (localStorage.getItem("weeklies")) {
      this.weeklies = JSON.parse(localStorage.getItem("weeklies"));
      this.weeklyBossDataChecker();
      this.weeklyTaskDataChecker();
      this.updateChecker();

      // if the data is not a new set check if the loaded data has a weeklygroup that is fully disabled
      this.checkIfWeeklyGroupsAreFullyDisabled();

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
          // if the image of the old task is custom.png its a custom task and should be moved over to the new structure
          if (oldWeeklies[i].weeklyBosses[j].type == "custom" || oldWeeklies[i].weeklyBosses[j].image == "Custom.png") {
            // if it doesn't have the type attribute due to being a custom daily from before the addition of the type system
            oldWeeklies[i].weeklyBosses[j]["type"] = "custom";
            // if the custom image url = "Custom.png" change this to a diffrent url for compatability with the new system
            if (oldWeeklies[i].weeklyBosses[j]["image"] == "Custom.png") {
              oldWeeklies[i].weeklyBosses[j]["image"] = "assets/Games/Maplestory/Weeklies/" + "Custom.png";
            }
            this.weeklies[i].weeklyBosses.push(oldWeeklies[i].weeklyBosses[j]);
            continue;
          }

          for (let k = 0; k < newWeekliesStructure[i].weeklyBosses.length; k++) {
            if (oldWeeklies[i].weeklyBosses[j].name == newWeekliesStructure[i].weeklyBosses[k].name) {
              // transfer the name, completed & enabled values from oldweeklies and image from the new structure into a temporary object
              var transferTask: Task = {
                name: oldWeeklies[i].weeklyBosses[j].name,
                image: newWeekliesStructure[i].weeklyBosses[k].image,
                completed: oldWeeklies[i].weeklyBosses[j].completed,
                enabled: oldWeeklies[i].weeklyBosses[j].enabled,
                type: newWeekliesStructure[i].weeklyBosses[k].image
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
            enabled: newWeekliesStructure[i].weeklyBosses[j].enabled,
            type: newWeekliesStructure[i].weeklyBosses[j].image
          };
          this.weeklies[i].weeklyBosses.push(transferTask);
        }

        // update weekly tasks
        this.weeklies[i].weeklyTasks = [];
        // copy over all data from weeklytasks that still exist in the new structure
        for (let j = 0; j < oldWeeklies[i].weeklyTasks.length; j++) {
          // if the image of the old task is custom.png its a custom task and should be moved over to the new structure
          if (oldWeeklies[i].weeklyTasks[j].type == "custom" || oldWeeklies[i].weeklyTasks[j].image == "Custom.png") {
            // if it doesn't have the type attribute due to being a custom daily from before the addition of the type system
            oldWeeklies[i].weeklyTasks[j]["type"] = "custom";
            // if the custom image url = "Custom.png" change this to a diffrent url for compatability with the new system
            if (oldWeeklies[i].weeklyTasks[j]["image"] == "Custom.png") {
              oldWeeklies[i].weeklyTasks[j]["image"] = "assets/Games/Maplestory/Weeklies/" + "Custom.png";
            }
            this.weeklies[i].weeklyTasks.push(oldWeeklies[i].weeklyTasks[j]);
            continue;
          }

          for (let k = 0; k < newWeekliesStructure[i].weeklyTasks.length; k++) {
            if (oldWeeklies[i].weeklyTasks[j].name == newWeekliesStructure[i].weeklyTasks[k].name) {
              // transfer the name, completed & enabled values from oldweeklies and image from the new structure into a temporary object
              var transferTask: Task = {
                name: oldWeeklies[i].weeklyTasks[j].name,
                image: newWeekliesStructure[i].weeklyTasks[k].image,
                completed: oldWeeklies[i].weeklyTasks[j].completed,
                enabled: oldWeeklies[i].weeklyTasks[j].enabled,
                type: newWeekliesStructure[i].weeklyTasks[k].image
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
            enabled: newWeekliesStructure[i].weeklyTasks[j].enabled,
            type: newWeekliesStructure[i].weeklyTasks[j].image
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

    if (lastVisit < lastThursday) {
      this.resetWeeklyBossesCompletedValues();
    }
  }

  weeklyTaskDataChecker() {
    var lastMonday = this.getPreviousDayOfWeek(1);

    var lastVisit = localStorage.getItem("lastMapleWeeklyTrackerVisit") ? localStorage.getItem("lastMapleWeeklyTrackerVisit") : 0;

    if (lastVisit < lastMonday) {
      this.resetWeeklyTasksCompletedValues();
    }
  }

  regionChange(event: any) {
    this.selectedRegionIndex = event.target.selectedIndex;
    this.resetUtcOffset = this.regions[event.target.selectedIndex].resetUtcOffset;
    localStorage.setItem("mapleRegion", JSON.stringify(this.selectedRegionIndex));

    // re do the checks for previous day data & setup the timers for the new resetUtcOffset
    this.initialise();
  }

  weekliesChangeHandler() {
    localStorage.setItem("weeklies", JSON.stringify(this.weeklies));
  }

  changeCharacter(characterIndex: number) {
    this.characterIndex = characterIndex;

    // recheck if a group is disabled for a diffrent character
    this.checkIfWeeklyGroupsAreFullyDisabled();
  }

  disableWeeklyBoss(taskIndex: number) {
    if (!this.editModeActive) {
      return;
    }

    if (this.weeklies[this.characterIndex].weeklyBosses[taskIndex].type == "custom" || this.weeklies[this.characterIndex].weeklyBosses[taskIndex].image == "Custom.png") {
      this.weeklies[this.characterIndex].weeklyBosses.splice(taskIndex, 1);
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

    if (this.weeklies[this.characterIndex].weeklyTasks[taskIndex].type == "custom" || this.weeklies[this.characterIndex].weeklyTasks[taskIndex].image == "Custom.png") {
      this.weeklies[this.characterIndex].weeklyTasks.splice(taskIndex, 1);
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
      // recheck if there is a weeklygroup that is fully disabled
      this.checkIfWeeklyGroupsAreFullyDisabled();
    } else {
      this.editModeActive = true;
      this.editButtonMessage = "Exit Edit Mode";
    }
  }

  startWeeklyBossesTimer() {
    clearInterval(this.timerWeeklyBosses);

    var endTime = this.getNextDayOfWeek(4)
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

    var endTime = this.getNextDayOfWeek(1)
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
    var currentDay = new Date();
    var resultDate = new Date(Date.UTC(currentDay.getUTCFullYear(), currentDay.getUTCMonth(), currentDay.getUTCDate(), 0, 0, 0, 0));

    resultDate.setTime(resultDate.getTime() + (((7 + dayOfWeek - resultDate.getUTCDay() - 1) % 7 + 1) * 24 * 60 * 60 * 1000));

    // calculate the offset from UTC if the time to countdown is in the past it means that a week needs to be added
    // WARNING: countdowns to timezones behind utc might not work properly (Have fun future me if this needs to be added :) )
    var resultDateEpoch = resultDate.valueOf();
    resultDateEpoch = resultDateEpoch - (this.resetUtcOffset * 60 * 60 * 1000)

    if (resultDateEpoch < currentDay.getTime()) {
      resultDateEpoch += (7 * 24 * 60 * 60 * 1000);
    }

    return resultDateEpoch;
  }

  getPreviousDayOfWeek(dayOfWeek) {
    var resultDate = this.getNextDayOfWeek(dayOfWeek);
    resultDate -= (24 * 60 * 60 * 1000 * 7);
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

  checkIfWeeklyGroupsAreFullyDisabled() {
    if (this.weeklies[this.characterIndex].weeklyBosses.some(item => item.enabled)) {
      this.allWeeklyBossesDisabled = false;
    } else {
      this.allWeeklyBossesDisabled = true;
    }

    if (this.weeklies[this.characterIndex].weeklyTasks.some(item => item.enabled)) {
      this.allWeeklyTasksDisabled = false;
    } else {
      this.allWeeklyTasksDisabled = true;
    }
  }

  addCustomWeekly(customWeeklyType: string) {
    this.addingCustomWeekly = true;
    this.customWeeklyType = customWeeklyType;
  }

  confirmAddingCustomWeekly() {
    if (this.customWeeklyName != "") {
      // if the user didn't specify an url set it to the default icon
      if (this.customWeeklyImageUrl == "") {
        this.customWeeklyImageUrl = "assets/Games/Maplestory/Weeklies/Custom.png";
      }

      var newTask: Task = {
        name: this.customWeeklyName,
        image: this.customWeeklyImageUrl,
        completed: false,
        enabled: true,
        type: "custom"
      }

      if (this.customWeeklyType == "boss") {
        this.weeklies[this.characterIndex].weeklyBosses.push(newTask);
      }

      if (this.customWeeklyType == "task") {
        this.weeklies[this.characterIndex].weeklyTasks.push(newTask);
      }

      this.weekliesChangeHandler();
      this.addingCustomWeekly = false;
      this.customWeeklyName = "";
      this.customWeeklyImageUrl = "";
    }
  }

  cancelAddingCustomWeekly() {
    this.addingCustomWeekly = false;
    this.customWeeklyName = "";
    this.customWeeklyImageUrl = "";
  }
}