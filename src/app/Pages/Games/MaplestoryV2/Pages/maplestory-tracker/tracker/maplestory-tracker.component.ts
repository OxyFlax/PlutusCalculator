import { Component, OnInit, OnDestroy } from '@angular/core';
import DailiesJsonV2 from '../../../../../../../assets/Games/Maplestory/DailiesV2.json';
import { Meta, Title } from '@angular/platform-browser';
import { GeneralData } from '../../../Models/generalData';
import { CharacterData } from '../../../Models/characterData';
import { GeneralDataService } from '../../../Services/generalData.service';
import { TaskService } from '../../../Services/task.service';

// TODO: look into seeing if its possible to also show the info thing when loading the data fails

@Component({
  selector: 'app-maplestory-tracker',
  templateUrl: './maplestory-tracker.component.html',
  styleUrls: ['./maplestory-tracker.component.css']
})
export class MaplestoryTrackerComponent implements OnInit, OnDestroy {
  generalData: GeneralData;
  selectedCharacter: CharacterData;

  editMode: boolean = true;

  

  constructor(private titleService: Title, private metaService: Meta, private generalDataService: GeneralDataService, private taskService: TaskService) { }

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
  }

  initialise() {
    if (localStorage.getItem("generalData")) {
      this.generalData = JSON.parse(localStorage.getItem("generalData"));

      this.taskService.dailyUpdateChecker(this.generalData);
      this.dailyResetChecker();

      this.fetchSelectedUserData();
    } else {
      // generate general data & 4 starting characters (it's saved in the creation step)
      this.generalData = this.generalDataService.initiateDataSet();
      
      this.fetchSelectedUserData();
    }
  }

  fetchSelectedUserData(){
    // fetch the selected user index with an if so errors can be caught, if it doesn't exist create it for that character and maybe show a pop up?
    if(localStorage.getItem(this.generalData.characters[this.generalData.selectedCharacterIndex].characterStorageReference)) {
      this.selectedCharacter = JSON.parse(localStorage.getItem(this.generalData.characters[this.generalData.selectedCharacterIndex].characterStorageReference));
    } else {
      // TODO: potentially add a warning message bottom right pop up to tell users there was something wrong
      this.selectedCharacter = this.generalDataService.addCharacterWithExistingReference(this.generalData.characters[this.generalData.selectedCharacterIndex].characterStorageReference);
    }
  }

  dailyResetChecker() {
    var lastReset = this.calculateResetTime() - (24 * 60 * 60 * 1000);
    var lastVisit = parseInt(this.generalData.trackerInfo.lastDailyTrackerVisit);

    if (lastVisit < lastReset) {
      this.taskService.resetDailyCompletion(this.generalData);
    }

    // set last visit to the current time
    this.generalData.trackerInfo.lastDailyTrackerVisit = Date.now().toString();
    this.generalDataChangeHandler();
  }

  calculateResetTime(): number {
    var date = new Date();
    var endTime = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 0, 0, 0, 0);

    // calculate the offset from UTC if the time to countdown is in the past it means that a day needs to be added
    // WARNING: countdowns to timezones behind utc might not work properly (Have fun future me if this needs to be added :) )
    endTime = endTime - (this.generalData.mapleRegion.resetUtcOffset * 60 * 60 * 1000)
    if (endTime < date.getTime()) {
      endTime += (24 * 60 * 60 * 1000);
    }

    return endTime;
  }






  changeHandler() {
    //TODO: save character data to localstorage
  }


  generalDataChangeHandler() {
    localStorage.setItem("generalData", JSON.stringify(this.generalData));
    //TODO: review this later on
    //this.checkIfAllGroupsAreDisabled();
  }
}