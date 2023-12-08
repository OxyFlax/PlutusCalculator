import { Component, OnInit, OnDestroy } from '@angular/core';
import DailiesJsonV2 from '../../../../../../../assets/Games/Maplestory/DailiesV2.json';
import { Meta, Title } from '@angular/platform-browser';
import { TaskData } from '../../../Models/taskModels';
import { Region } from '../../../Models/region';
import { TaskService } from '../../../Services/task.service';

// TODO: look into seeing if its possible to also show the info thing when loading the data fails

@Component({
  selector: 'app-maplestory-dailies-v3',
  templateUrl: './maplestory-dailies-v3.component.html',
  styleUrls: ['./maplestory-dailies-v3.component.css']
})
export class MaplestoryDailiesV3Component implements OnInit, OnDestroy {
  initialisationComplete: boolean = false;
  showInfo: boolean = false;

  characterIndex: number = 0;
  dailiesData: TaskData;
  allGroupsAreDisabled: boolean;

  timer: any;
  timerString: string;

  regions: Array<Region> = [
    { resetUtcOffset: 0, name: 'GMS' },
    { resetUtcOffset: 8, name: 'MSEA' },
    { resetUtcOffset: 9, name: 'KMS' }
  ];

  constructor(private titleService: Title, private metaService: Meta, private taskService: TaskService) { }

  ngOnInit() {
    this.titleService.setTitle("Maplestory Dailies Tracker | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "A dailies tracker for Maplestory to keep track of your completed daily tasks. Keep track of your dailies across multiple different characters." });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }

    this.initialise();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  initialise() {
    if (localStorage.getItem("dailiesDataV3")) {
      this.dailiesData = JSON.parse(localStorage.getItem("dailiesDataV3"));

      // this code fixes an error caused by me not checking if the users has a mapleRegion record in their localstorage causing it to become undefined.
      // set it to the default value (aka the value people who don't have a mapleRegion record use)
      if (this.dailiesData.mapleRegion === undefined) {
        var region: Region = { resetUtcOffset: 0, name: 'GMS' };
        this.dailiesData.mapleRegion = region;
      }

      // prevents the page from loading in editmode
      this.dailiesData.editModeActive = false;

      this.dailyResetChecker();
      this.updateChecker();

      // checks if all groups are disabled to notify users to enable dailies in the editmode
      this.checkIfAllGroupsAreDisabled();
    } else {
      // Check if v2 data exists, if so update it to v3 format
      if (localStorage.getItem("dailiesData")) {
        // triger update
        this.dailiesData = this.taskService.v2v3Updater("dailiesData");

        // save the updated data to localstorage
        this.changeHandler();

        // send it through initialise again to check for version update etc
        this.initialise();
      } else {
        // initiate a new dataset of 4 characters
        this.dailiesData = this.taskService.initiateDataSet(DailiesJsonV2, 4);
      }
    }

    this.startTimer();
    
    this.initialisationComplete = true;
  }

  dailyResetChecker() {
    var lastReset = this.calculateResetTime() - (24 * 60 * 60 * 1000);
    var lastVisit = parseInt(this.dailiesData.lastTrackerVisit);

    if (lastVisit < lastReset) {
      this.taskService.resetCompletionAll(this.dailiesData);
    }

    // set last visit to the current time
    this.dailiesData.lastTrackerVisit = Date.now().toString();
    this.changeHandler();
  }

  updateChecker() {
    // if the current version doesn't match the new version update the task structure
    if (this.dailiesData.version != DailiesJsonV2.version) {
      this.dailiesData = this.taskService.updateTaskStructure(this.dailiesData, DailiesJsonV2);
      // save the updated data
      this.changeHandler();
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

  calculateResetTime(): number {
    var date = new Date();
    var endTime = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 0, 0, 0, 0);

    // calculate the offset from UTC if the time to countdown is in the past it means that a day needs to be added
    // WARNING: countdowns to timezones behind utc might not work properly (Have fun future me if this needs to be added :) )
    endTime = endTime - (this.dailiesData.mapleRegion.resetUtcOffset * 60 * 60 * 1000)
    if (endTime < date.getTime()) {
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

  liveReset() {
    this.taskService.resetCompletionAll(this.dailiesData);
    this.startTimer();
    this.dailiesData.lastTrackerVisit = (parseInt(Date.now().toString()) + 5000).toString();
    this.changeHandler();
  }

  //WARNING: event dailies will mess with this if they are hidden from the user when past their date
  checkIfAllGroupsAreDisabled() {
    this.allGroupsAreDisabled = !this.dailiesData.characters[this.dailiesData.selectedCharacterIndex].taskGroups.some(item => !item.allDisabled);
  }

  addCharacter() {
    this.taskService.addCharacter(this.dailiesData, DailiesJsonV2);
    this.changeHandler();
  }

  // reset all data to remove any issues
  infoReset() {
    // remove both stored data objects
    localStorage.removeItem('dailies');
    localStorage.removeItem('dailiesData');
    localStorage.removeItem('dailiesDataV3');

    // recall the initialise to repopulate the data
    this.initialise();
    this.dailiesData.infoVisible = true;
  }

  infoDismiss() {
    this.dailiesData.infoVisible = false;
    this.changeHandler();
  }

  changeHandler() {
    localStorage.setItem("dailiesDataV3", JSON.stringify(this.dailiesData));
    this.checkIfAllGroupsAreDisabled();
  }

  regionChangeHandler() {
    this.dailyResetChecker();
    this.startTimer();
  }
}