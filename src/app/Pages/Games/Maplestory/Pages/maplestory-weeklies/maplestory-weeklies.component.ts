import { Component, OnInit, OnDestroy } from '@angular/core';
import WeekliesJson from '../../../../../../assets/Games/Maplestory/Weeklies.json';
import { Weeklies } from '../../Models/weeklies';


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

  characterIndex: number = 0;
  editModeActive: boolean = false;
  weeklies: Weeklies[] = [];
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
      var oldWeeklies: Weeklies[] = JSON.parse(localStorage.getItem("weeklies"));
      // set the data to the new structure
      this.initiateData();
      for (let i = 0; i < this.weeklies.length; i++) {
        // move over the name
        this.weeklies[i].characterName = oldWeeklies[i].characterName;

        // update weekly boss data
        for (let j = 0; j < this.weeklies[i].weeklyBosses.length; j++) {
          for (let k = 0; k < oldWeeklies[i].weeklyBosses.length; k++) {
            if (this.weeklies[i].weeklyBosses[j].name == oldWeeklies[i].weeklyBosses[k].name) {
              this.weeklies[i].weeklyBosses[j].completed = oldWeeklies[i].weeklyBosses[k].completed;
              this.weeklies[i].weeklyBosses[j].enabled = oldWeeklies[i].weeklyBosses[k].enabled;
              oldWeeklies[i].weeklyBosses.splice(k, 1);
            }
          }
        }

        // update weekly task data
        for (let j = 0; j < this.weeklies[i].weeklyTasks.length; j++) {
          for (let k = 0; k < oldWeeklies[i].weeklyTasks.length; k++) {
            if (this.weeklies[i].weeklyTasks[j].name == oldWeeklies[i].weeklyTasks[k].name) {
              this.weeklies[i].weeklyTasks[j].completed = oldWeeklies[i].weeklyTasks[k].completed;
              this.weeklies[i].weeklyTasks[j].enabled = oldWeeklies[i].weeklyTasks[k].enabled;
              oldWeeklies[i].weeklyTasks.splice(k, 1);
            }
          }
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

  weekliesChangeHandler() {
    localStorage.setItem("weeklies", JSON.stringify(this.weeklies));
  }

  changeCharacter(characterIndex: number) {
    this.characterIndex = characterIndex;
  }

  disableWeeklyBoss(event: any, taskIndex: number) {
    event.preventDefault();
    if (!this.editModeActive) {
      return;
    }

    if (this.weeklies[this.characterIndex].weeklyBosses[taskIndex].enabled) {
      this.weeklies[this.characterIndex].weeklyBosses[taskIndex].enabled = false;
    } else {
      this.weeklies[this.characterIndex].weeklyBosses[taskIndex].enabled = true;
    }
  }

  disableWeeklyTask(event: any, taskIndex: number) {
    event.preventDefault();
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
    var currentDay = new Date();
    var resultDate = new Date(Date.UTC(currentDay.getUTCFullYear(), currentDay.getUTCMonth(), currentDay.getUTCDate(), 0, 0, 0, 0));

    resultDate.setTime(resultDate.getTime() + (((7 + dayOfWeek - resultDate.getUTCDay() - 1) % 7 + 1) * 24 * 60 * 60 * 1000));
    return resultDate;
  }

  getPreviousDayOfWeek(dayOfWeek) {
    var resultDate = this.getNextDayOfWeek(dayOfWeek);
    resultDate.setTime(resultDate.getTime() - (24 * 60 * 60 * 1000 * 7));
    return resultDate;
  }

  moveWeeklyBoss(index: number, direction: string){
    if(direction == "up") {
      if(index == 0) {
        return;
      }
      var temp = this.weeklies[this.characterIndex].weeklyBosses[index - 1];
      this.weeklies[this.characterIndex].weeklyBosses[index - 1] = this.weeklies[this.characterIndex].weeklyBosses[index];
      this.weeklies[this.characterIndex].weeklyBosses[index] = temp;
    }

    if(direction == "down") {
      if(index + 1 == this.weeklies[this.characterIndex].weeklyBosses.length){
        return;
      }
      var temp = this.weeklies[this.characterIndex].weeklyBosses[index + 1];
      this.weeklies[this.characterIndex].weeklyBosses[index + 1] = this.weeklies[this.characterIndex].weeklyBosses[index];
      this.weeklies[this.characterIndex].weeklyBosses[index] = temp;
    }
  }

  moveWeeklyTask(index: number, direction: string){
    if(direction == "up") {
      if(index == 0) {
        return;
      }
      var temp = this.weeklies[this.characterIndex].weeklyTasks[index - 1];
      this.weeklies[this.characterIndex].weeklyTasks[index - 1] = this.weeklies[this.characterIndex].weeklyTasks[index];
      this.weeklies[this.characterIndex].weeklyTasks[index] = temp;
    }

    if(direction == "down") {
      if(index + 1 == this.weeklies[this.characterIndex].weeklyTasks.length){
        return;
      }
      var temp = this.weeklies[this.characterIndex].weeklyTasks[index + 1];
      this.weeklies[this.characterIndex].weeklyTasks[index + 1] = this.weeklies[this.characterIndex].weeklyTasks[index];
      this.weeklies[this.characterIndex].weeklyTasks[index] = temp;
    }
  }
}