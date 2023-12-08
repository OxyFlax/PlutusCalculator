import { Component, OnInit, OnDestroy } from '@angular/core';
import WeekliesJsonV2 from '../../../../../../../assets/Games/Maplestory/WeekliesV2.json';
import { Meta, Title } from '@angular/platform-browser';
import { TaskData, CharacterData, Task } from '../../../Models/taskModels';
import { Region } from '../../../Models/region';
import { TaskService } from '../../../Services/task.service';

@Component({
  selector: 'app-maplestory-weeklies-v3',
  templateUrl: './maplestory-weeklies-v3.component.html',
  styleUrls: ['./maplestory-weeklies-v3.component.css']
})
export class MaplestoryWeekliesV3Component implements OnInit, OnDestroy {
  initialisationComplete: boolean = false;
  showInfo: boolean = false;

  characterIndex: number = 0;
  weekliesData: TaskData;
  allGroupsAreDisabled: boolean;

  timers: any[] = [];
  timerStrings: string[] = ["", "", ""];

  regions: Array<Region> = [
    { resetUtcOffset: 0, name: 'GMS' },
    { resetUtcOffset: 8, name: 'MSEA' },
    { resetUtcOffset: 9, name: 'KMS' }
  ];

  constructor(private titleService: Title, private metaService: Meta, private taskService: TaskService) { }

  ngOnInit() {
    this.titleService.setTitle("Maplestory Weeklies Tracker | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "A weeklies tracker for Maplestory to keep track of your completed weekly tasks. Keep track of your weeklies across multiple different characters." });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }

    // this.infoInit();
    this.initialise();
  }

  ngOnDestroy() {
    if (this.timers[0]) {
      clearInterval(this.timers[0]);
    }

    if (this.timers[1]) {
      clearInterval(this.timers[1]);
    }
  }

  initialise() {
    if (localStorage.getItem("weekliesDataV3")) {
      this.weekliesData = JSON.parse(localStorage.getItem("weekliesDataV3"));

      // this code fixes an error caused by me not checking if the users has a mapleRegion record in their localstorage causing it to become undefined.
      // set it to the default value (aka the value people who don't have a mapleRegion record use)
      if (this.weekliesData.mapleRegion === undefined) {
        var region: Region = { resetUtcOffset: 0, name: 'GMS' };
        this.weekliesData.mapleRegion = region;
      }

      // prevents the page from loading in editmode
      this.weekliesData.editModeActive = false;

      this.weeklyResetChecker();
      this.updateChecker();

      // checks if all groups are disabled to notify users to enable dailies in the editmode
      this.checkIfAllGroupsAreDisabled();
    } else {
      // Check if v2 data exists, if so update it to v3 format
      if (localStorage.getItem("weekliesData")) {
        // triger update
        this.weekliesData = this.taskService.v2v3Updater("weekliesData");

        // save the updated data to localstorage
        this.changeHandler();

        // send it through initialise again to check for version update etc
        this.initialise();
      } else {
        // initiate a new dataset of 4 characters
        this.weekliesData = this.taskService.initiateDataSet(WeekliesJsonV2, 4);
      }
    }

    // 0 starts weekly boss timer, 1 starts weekly task timer
    this.startTimer(0);
    this.startTimer(1);

    this.initialisationComplete = true;
  }

  weeklyResetChecker() {
    var lastThursday = this.calculateResetDayTime(4) - (7 * 24 * 60 * 60 * 1000);
    var lastMonday = this.calculateResetDayTime(1) - (7 * 24 * 60 * 60 * 1000);

    var lastVisit = parseInt(this.weekliesData.lastTrackerVisit);

    if (lastVisit < lastThursday) {
      this.taskService.resetCompletionIndex(this.weekliesData, 0);
    }

    if (lastVisit < lastMonday) {
      this.taskService.resetCompletionIndex(this.weekliesData, 1);
      this.taskService.resetCompletionIndex(this.weekliesData, 2);
    }

    this.weekliesData.lastTrackerVisit = Date.now().toString();
    this.changeHandler();
  }

  updateChecker() {
    // if the current version doesn't match the new version update the task structure
    if (this.weekliesData.version != WeekliesJsonV2.version) {
      this.weekliesData = this.taskService.updateTaskStructure(this.weekliesData, WeekliesJsonV2);
      // save the updated data
      this.changeHandler();
    }
  }

  startTimer(taskGroupIndex: number) {
    clearInterval(this.timers[taskGroupIndex]);

    var endTime;

    // if the index is 0 the reset is for weeklybosses on thursday else it is 1 which is the reset for weeklytasks on sunday
    if (taskGroupIndex == 0) {
      endTime = this.calculateResetDayTime(4);
    } else {
      endTime = this.calculateResetDayTime(1);
    }

    this.calculateAndOutPutTimes(endTime - new Date().getTime(), taskGroupIndex);

    this.timers[taskGroupIndex] = setInterval(() => {
      var distance = endTime - new Date().getTime();
      this.calculateAndOutPutTimes(distance, taskGroupIndex);

      if (distance < 0) {
        clearInterval(this.timers[taskGroupIndex]);
        this.liveReset(taskGroupIndex);
      }
    }, 1000);
  }

  calculateResetDayTime(dayOfWeek) {
    var currentDay = new Date();
    var resultDate = new Date(Date.UTC(currentDay.getUTCFullYear(), currentDay.getUTCMonth(), currentDay.getUTCDate(), 0, 0, 0, 0));

    resultDate.setTime(resultDate.getTime() + (((7 + dayOfWeek - resultDate.getUTCDay() - 1) % 7 + 1) * 24 * 60 * 60 * 1000));

    // calculate the offset from UTC if the time to countdown is in the past it means that a week needs to be added
    // WARNING: countdowns to timezones behind utc might not work properly (Have fun future me if this needs to be added :) )
    var resultDateEpoch = resultDate.valueOf();
    resultDateEpoch = resultDateEpoch - (this.weekliesData.mapleRegion.resetUtcOffset * 60 * 60 * 1000)

    if (resultDateEpoch < currentDay.getTime()) {
      resultDateEpoch += (7 * 24 * 60 * 60 * 1000);
    }

    return resultDateEpoch;
  }

  calculateAndOutPutTimes(distance: number, taskGroupIndex: number) {
    if (distance < 0) {
      this.timerStrings[taskGroupIndex] = "RESET!";
      // Also show the reset text in the arcane river weeklies
      if(taskGroupIndex == 1) {
        this.timerStrings[2] = "RESET!";
      }
      return;
    }

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.timerStrings[taskGroupIndex] = days + "d " + hours + "h " + minutes + "m " + ("00" + seconds).slice(-2) + "s ";
    // Duplicate the weekly task timer into the arcane river weeklies
    if(taskGroupIndex == 1) {
      this.timerStrings[2] = this.timerStrings[taskGroupIndex];
    }
  }

  liveReset(taskGroupIndex: number) {
    this.taskService.resetCompletionIndex(this.weekliesData, taskGroupIndex);
    //makes sure that arcane weekly live reset works (as there is no separate time for this)
    if (taskGroupIndex == 1) {
      this.taskService.resetCompletionIndex(this.weekliesData, 2);
    }
    this.startTimer(taskGroupIndex);
    this.weekliesData.lastTrackerVisit = (parseInt(Date.now().toString()) + 5000).toString();
    this.changeHandler();
  }

  //WARNING: event dailies will mess with this if they are hidden from the user when past their date
  checkIfAllGroupsAreDisabled() {
    this.allGroupsAreDisabled = !this.weekliesData.characters[this.weekliesData.selectedCharacterIndex].taskGroups.some(item => !item.allDisabled);
  }

  addCharacter() {
    this.taskService.addCharacter(this.weekliesData, WeekliesJsonV2);
    this.changeHandler();
  }

  // reset all data to remove any issues
  infoReset() {
    // remove both stored data objects
    localStorage.removeItem('weeklies');
    localStorage.removeItem('weekliesData');
    localStorage.removeItem('weekliesDataV3');

    // recall the initialise to repopulate the data
    this.initialise();
    this.weekliesData.infoVisible = true;
  }

  infoDismiss() {
    this.weekliesData.infoVisible = false;
    this.changeHandler();
  }

  changeHandler() {
    localStorage.setItem("weekliesDataV3", JSON.stringify(this.weekliesData));
    this.checkIfAllGroupsAreDisabled();
  }

  regionChangeHandler() {
    this.weeklyResetChecker();

    // 0 starts weekly boss timer, 1 starts weekly task timer
    this.startTimer(0);
    this.startTimer(1);
  }
}