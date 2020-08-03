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
    }
    this.startTimer();
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

    var lastVisit = localStorage.getItem("lastMapleDailyTrackerVisitTest") ? localStorage.getItem("lastMapleDailyTrackerVisitTest") : 0;

    if (lastVisit < currentUtcDay) {
      this.resetCompletedValues();
    }

    // reset last visit to the current time
    localStorage.setItem("lastMapleDailyTrackerVisitTest", Date.now().toString());
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
    localStorage.setItem("lastMapleDailyTrackerVisitTest", (parseInt(Date.now().toString()) + 5000).toString());
  }
}