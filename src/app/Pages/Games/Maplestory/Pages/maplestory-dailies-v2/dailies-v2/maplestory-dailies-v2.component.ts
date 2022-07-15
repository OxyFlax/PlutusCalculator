import { Component, OnInit, OnDestroy } from '@angular/core';
import DailiesJson from '../../../../../../../assets/Games/Maplestory/Dailies.json';
import { Meta, Title } from '@angular/platform-browser';
import { TaskData, CharacterData, Task } from '../../../Models/taskModels';
import { Region } from '../../../Models/region';


// When upgrading the trackers from v1 to v2 a function to update the saved data was added.
// Removal done: June 10 2021
//
// Removal possible after: June 21 2021
// In the updatechecker a removal of the "old tracker custom task support" can be done too. Since there has been more than enough time for all old tracker objects to receive the type = custom

@Component({
  selector: 'app-maplestory-dailies-v2',
  templateUrl: './maplestory-dailies-v2.component.html',
  styleUrls: ['./maplestory-dailies-v2.component.css']
})
export class MaplestoryDailiesV2Component implements OnInit, OnDestroy {
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

  showInfo: boolean;
  
  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Maplestory Dailies Tracker | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "A dailies tracker for Maplestory to keep track of your completed daily tasks. Keep track of your dailies across multiple different characters." });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }

    // enable this if you want to show info to the user about a change to the page
    // this.infoInit();
    this.initialise();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  initialise() {
    if (localStorage.getItem("dailiesData")) {
      this.dailiesData = JSON.parse(localStorage.getItem("dailiesData"));

      // this code fixes an error caused by me not checking if the users has a mapleRegion record in their localstorage causing it to become undefined.
      // set it to the default value (aka the value people who don't have a mapleRegion record use)
      if(this.dailiesData.mapleRegion === undefined)
      {
        var region: Region = { resetUtcOffset: 0, name: 'GMS' };
        this.dailiesData.mapleRegion = region;
      }

      // prevents the page from loading in editmode
      this.dailiesData.editModeActive = false;

      this.checkIfDataIsFromPreviousDay();
      this.updateChecker();

      // checks if all groups are disabled to notify users to enable dailies in the editmode
      this.checkIfAllGroupsAreDisabled();
    } else {
        // initiate a dataset
        this.initiateDataSet();
    }

    this.startTimer();
  }

  // v1v2Updater() {
  //   var version: string;
  //   var lastTrackerVisit: string;
  //   var mapleRegion: Region;
  //   var regions: Array<Region> = [
  //     { resetUtcOffset: 0, name: 'GMS' },
  //     { resetUtcOffset: 8, name: 'MSEA' },
  //     { resetUtcOffset: 9, name: 'KMS' }
  //   ];

  //   if(localStorage.getItem("dailiesVersion")) {
  //     version = localStorage.getItem("dailiesVersion"); 
  //   } else {
  //     version = "0";
  //   }

  //   if(localStorage.getItem("lastMapleDailyTrackerVisit")) {
  //     lastTrackerVisit = localStorage.getItem("lastMapleDailyTrackerVisit"); 
  //   } else {
  //     lastTrackerVisit = "0";
  //   }

  //   if(localStorage.getItem("mapleRegion")) {
  //     mapleRegion = regions[JSON.parse(localStorage.getItem("mapleRegion"))];
  //   } else {
  //     mapleRegion =  regions[0];
  //   }

  //   var newDailiesData: TaskData = {
  //     characters: [],
  //     version: version,
  //     lastTrackerVisit: lastTrackerVisit,
  //     selectedCharacterIndex: 0,
  //     mapleRegion: mapleRegion,
  //     editModeActive: false
  //   };

  //   var oldDailies: Dailies[] = JSON.parse(localStorage.getItem("dailies"));
    
  //   for (let i = 0; i < oldDailies.length; i++) {
  //     var newCharacter: CharacterData = {
  //       characterName: oldDailies[i].characterName,
  //       taskGroups: [
  //         { title: 'Daily Bosses', tasks: oldDailies[i].dailyBosses, allDisabled: false },
  //         { title: 'Daily Tasks', tasks: oldDailies[i].dailyTasks, allDisabled: false },
  //         { title: 'Arcane River Dailies', tasks: oldDailies[i].dailyArcaneRiver, allDisabled: false }
  //       ]
  //     };
  //     newDailiesData.characters.push(newCharacter);
  //   }

  //   this.dailiesData = newDailiesData;
  //   this.changeHandler();
  //   localStorage.removeItem('dailiesVersion');
  //   localStorage.removeItem('lastMapleDailyTrackerVisit');
  //   localStorage.removeItem('dailies');

  //   // at the end resend it through the initialise to check for version update etc 
  //   this.initialise();
  // }

  initiateDataSet() {
    var newCharacterList: CharacterData = {
      characterName: "",
      taskGroups: [
        { title: 'Daily Bosses', tasks: DailiesJson.dailyBosses, allDisabled: false },
        { title: 'Daily Tasks', tasks: DailiesJson.dailyTasks, allDisabled: false },
        { title: 'Arcane River Dailies', tasks: DailiesJson.dailyArcaneRiver, allDisabled: false }
      ]
    };

    var newDailiesData: TaskData = {
      characters: [],
      version: DailiesJson.version,
      lastTrackerVisit: Date.now().toString(),
      selectedCharacterIndex: 0,
      mapleRegion: {resetUtcOffset: 0, name: 'GMS'},
      editModeActive: false,
      infoVisible: false,
      imagePrefix: "DailiesImages"
    };

    for (let i = 0; i < 4; i++) {
      newCharacterList.characterName = "Char" + (i + 1);
      newDailiesData.characters[i] = JSON.parse(JSON.stringify(newCharacterList));
    };

    this.dailiesData = newDailiesData;
    this.changeHandler();
  }

  checkIfDataIsFromPreviousDay() {
    var lastReset = this.calculateResetTime() - (24 * 60 * 60 * 1000);
    var lastVisit = parseInt(this.dailiesData.lastTrackerVisit);

    if (lastVisit < lastReset) {
      this.resetCompletedValues();
    }

    // set last visit to the current time
    this.dailiesData.lastTrackerVisit = Date.now().toString();
    this.changeHandler();
  }

  updateChecker() {
    // if the current version doesn't match the new version update the data
    if (this.dailiesData.version != DailiesJson.version) {
      // copy the old dailiesData into a var to save them for value transfering
      var oldDailiesData: TaskData = JSON.parse(JSON.stringify(this.dailiesData));
      // load in the new data structure into the dailiesData var to transfer it to a newDailies array for verifying which dailies need to be added or removed
      this.initiateDataSet();
      var newDailiesStructure: TaskData = JSON.parse(JSON.stringify(this.dailiesData));

      for (let i = 0; i < oldDailiesData.characters.length; i++) {
        // move over the name
        this.dailiesData.characters[i].characterName = oldDailiesData.characters[i].characterName;
        // loop through all the old taskgroups for the character
        for(let j = 0; j < this.dailiesData.characters[i].taskGroups.length; j++) {
          // clear the current dailiesData (the old/new data will be saved to this)
          this.dailiesData.characters[i].taskGroups[j].tasks = [];

          // loop through all old tasks from the taskgroup
          for(let k = 0; k < oldDailiesData.characters[i].taskGroups[j].tasks.length; k++) {
            // if the type of the old task is "custom" or the image is "custom.png" it is a custom task and should be moved to the new structure
            if (oldDailiesData.characters[i].taskGroups[j].tasks[k].type == "custom" || oldDailiesData.characters[i].taskGroups[j].tasks[k].image == "Custom.png") {
              // if it doesn't have the type attribute due to being a custom daily from before the addition of the type system
              oldDailiesData.characters[i].taskGroups[j].tasks[k].type = "custom";
              // if the custom image url = "Custom.png" change this to a diffrent url for compatability with the new system
              if (oldDailiesData.characters[i].taskGroups[j].tasks[k].image == "Custom.png") {
                oldDailiesData.characters[i].taskGroups[j].tasks[k].image = "assets/Games/Maplestory/Tracker/" + "Custom.png";
              }
              this.dailiesData.characters[i].taskGroups[j].tasks.push(oldDailiesData.characters[i].taskGroups[j].tasks[k]);
              continue;
            }

            // if the old task isn't custom verify if it still exists in the new dailies structure if it does move it over
            for (let l = 0; l < newDailiesStructure.characters[i].taskGroups[j].tasks.length; l++) {
              if (oldDailiesData.characters[i].taskGroups[j].tasks[k].name == newDailiesStructure.characters[i].taskGroups[j].tasks[l].name) {
                // transfer the name, completed & enabled values from olddailies and image from the new structure into a temporary object
                var transferTask: Task = {
                  name: oldDailiesData.characters[i].taskGroups[j].tasks[k].name,
                  image: newDailiesStructure.characters[i].taskGroups[j].tasks[l].image,
                  done: oldDailiesData.characters[i].taskGroups[j].tasks[k].done,
                  enabled: oldDailiesData.characters[i].taskGroups[j].tasks[k].enabled,
                  type: newDailiesStructure.characters[i].taskGroups[j].tasks[l].type,
                  dispCon: newDailiesStructure.characters[i].taskGroups[j].tasks[l].dispCon
                };
                // add this task to the current dailies structure
                this.dailiesData.characters[i].taskGroups[j].tasks.push(transferTask);

                // remove the new task that was matched with an old existing one
                newDailiesStructure.characters[i].taskGroups[j].tasks.splice(l, 1);
              }
            }
          }
          // copy all left over new tasks over
          for (let k = 0; k < newDailiesStructure.characters[i].taskGroups[j].tasks.length; k++) {
            var transferTask: Task = {
              name: newDailiesStructure.characters[i].taskGroups[j].tasks[k].name,
              image: newDailiesStructure.characters[i].taskGroups[j].tasks[k].image,
              done: newDailiesStructure.characters[i].taskGroups[j].tasks[k].done,
              enabled: newDailiesStructure.characters[i].taskGroups[j].tasks[k].enabled,
              type: newDailiesStructure.characters[i].taskGroups[j].tasks[k].type,
              dispCon: newDailiesStructure.characters[i].taskGroups[j].tasks[k].dispCon
            };
            this.dailiesData.characters[i].taskGroups[j].tasks.push(transferTask);
          }
        }
      }
      // move over other properties including the new version
      this.dailiesData.version = DailiesJson.version;
      this.dailiesData.lastTrackerVisit = Date.now().toString();
      this.dailiesData.selectedCharacterIndex = oldDailiesData.selectedCharacterIndex;
      this.dailiesData.mapleRegion = oldDailiesData.mapleRegion;
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
    this.resetCompletedValues();
    this.startTimer();
    this.dailiesData.lastTrackerVisit = (parseInt(Date.now().toString()) + 5000).toString();
    this.changeHandler();
  }

  // This function resets all completed values
  resetCompletedValues() {
    this.dailiesData.characters.forEach(character => {
      character.taskGroups.forEach(taskgroup => {
        taskgroup.tasks.forEach(task => {
          task.done = false;
        });
      });
    });
  }

  changeHandler() {
    localStorage.setItem("dailiesData", JSON.stringify(this.dailiesData));
    this.checkIfAllGroupsAreDisabled();
  }

  checkIfAllGroupsAreDisabled() {
    this.allGroupsAreDisabled = !this.dailiesData.characters[this.dailiesData.selectedCharacterIndex].taskGroups.some(item => !item.allDisabled);
  }

  regionChangeHandler() {
    this.checkIfDataIsFromPreviousDay();

    this.startTimer();
  }


  
  infoInit() {
    if(localStorage.getItem("dailiesInfoViewed")) {
      this.showInfo = false;
    } else {
      this.showInfo = true;
    }
  }

  infoReset() {
    // remove both stored data objects
    localStorage.removeItem('dailies');
    localStorage.removeItem('dailiesData');

    // mark the message as read and hide it
    localStorage.setItem("dailiesInfoViewed", "yes");
    this.showInfo = false;

    // recall the initialise to repopulate the data
    this.initialise();
  }

  infoDismiss() {
    localStorage.setItem("dailiesInfoViewed", "yes");
    this.showInfo = false;
  }
}