import { Component, OnInit, OnDestroy } from '@angular/core';
import DailiesJson from '../../../../../../../assets/Games/GenshinImpact/Dailies.json';
import { Meta, Title } from '@angular/platform-browser';
import { Task, TaskData, CharacterData } from '../../../../Maplestory/Models/taskModels';
import { Region } from '../../../../Maplestory/Models/region';

// When upgrading the trackers from v1 to v2 a function to update the saved data was added.
// This is something that can be removed 2months after the upgrade so as many people as possible are able to enjoy a flawless transition
// Removal possible after: June 21 2021
// In the updatechecker a removal of the "old tracker custom task support" can be done too. Since there has been more than enough time for all old tracker objects to receive the type = custom


@Component({
  selector: 'app-genshin-dailies',
  templateUrl: './genshin-dailies.component.html',
  styleUrls: ['./genshin-dailies.component.css']
})
export class GenshinDailiesComponent implements OnInit, OnDestroy {
  characterIndex: number = 0;
  genshinDailiesData: TaskData;
  allGroupsAreDisabled: boolean;

  timer: any;
  timerString: string;

  regions: Array<Region> = [
    { resetUtcOffset: -9, name: 'NA' },
    { resetUtcOffset: -3, name: 'EU' },
    { resetUtcOffset: 4, name: 'ASIA' }
  ];
  
  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Genshin Impact Dailies Tracker | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "A dailies tracker for Genshin Impact to keep track of your completed daily tasks. Keep track of your dailies across multiple different characters." });
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
    if (localStorage.getItem("genshinDailiesData")) {
      this.genshinDailiesData = JSON.parse(localStorage.getItem("genshinDailiesData"));

      // prevents the page from loading in editmode
      this.genshinDailiesData.editModeActive = false;

      this.updateChecker();
      this.checkIfDataIsFromPreviousDay();

      // checks if all groups are disabled to notify users to enable dailies in the editmode
      this.checkIfAllGroupsAreDisabled();
    } else {
      // initiate a dataset
      this.initiateDataSet();
    }

    this.startTimer();
  }

  initiateDataSet() {
    var newCharacterList: CharacterData = {
      characterName: "",
      taskGroups: [
        { title: 'Daily Tasks', tasks: DailiesJson.dailyTasks, allDisabled: false }
      ]
    };

    var newGenshinDailiesData: TaskData = {
      characters: [],
      version: DailiesJson.version,
      lastTrackerVisit: Date.now().toString(),
      selectedCharacterIndex: 0,
      mapleRegion: {resetUtcOffset: -9, name: 'US'},
      editModeActive: false
    };

    for (let i = 0; i < 4; i++) {
      newCharacterList.characterName = "Char" + (i + 1);
      newGenshinDailiesData.characters[i] = JSON.parse(JSON.stringify(newCharacterList));
    };

    this.genshinDailiesData = newGenshinDailiesData;
    this.changeHandler();
  }

  checkIfDataIsFromPreviousDay() {
    var lastReset = this.calculateResetTime() - (24 * 60 * 60 * 1000);
    var lastVisit = parseInt(this.genshinDailiesData.lastTrackerVisit);

    if (lastVisit < lastReset) {
      this.resetCompletedValues();
    }

    // set last visit to the current time
    this.genshinDailiesData.lastTrackerVisit = Date.now().toString();
    this.changeHandler();
  }

  updateChecker() {
    // if the current version doesn't match the new version update the data
    if (this.genshinDailiesData.version != DailiesJson.version) {
      // copy the old dailiesData into a var to save them for value transfering
      var oldGenshinDailiesData: TaskData = JSON.parse(JSON.stringify(this.genshinDailiesData));
      // load in the new data structure into the genshinDailiesData var to transfer it to a newDailies array for verifying which dailies need to be added or removed
      this.initiateDataSet();
      var newGenshinDailiesStructure: TaskData = JSON.parse(JSON.stringify(this.genshinDailiesData));

      for (let i = 0; i < oldGenshinDailiesData.characters.length; i++) {
        // move over the name
        this.genshinDailiesData.characters[i].characterName = oldGenshinDailiesData.characters[i].characterName;
        // loop through all the old taskgroups for the character
        for(let j = 0; j < this.genshinDailiesData.characters[i].taskGroups.length; j++) {
          // clear the current genshinDailiesData (the old/new data will be saved to this)
          this.genshinDailiesData.characters[i].taskGroups[j].tasks = [];

          // loop through all old tasks from the taskgroup
          for(let k = 0; k < oldGenshinDailiesData.characters[i].taskGroups[j].tasks.length; k++) {
            // if the type of the old task is "custom" or the image is "custom.png" it is a custom task and should be moved to the new structure
            if (oldGenshinDailiesData.characters[i].taskGroups[j].tasks[k].type == "custom") {
              this.genshinDailiesData.characters[i].taskGroups[j].tasks.push(oldGenshinDailiesData.characters[i].taskGroups[j].tasks[k]);
              continue;
            }

            // if the old task isn't custom verify if it still exists in the new dailies structure if it does move it over
            for (let l = 0; l < newGenshinDailiesStructure.characters[i].taskGroups[j].tasks.length; l++) {
              if (oldGenshinDailiesData.characters[i].taskGroups[j].tasks[k].name == newGenshinDailiesStructure.characters[i].taskGroups[j].tasks[l].name) {
                // transfer the name, completed & enabled values from olddailies and image from the new structure into a temporary object
                var transferTask: Task = {
                  name: oldGenshinDailiesData.characters[i].taskGroups[j].tasks[k].name,
                  image: newGenshinDailiesStructure.characters[i].taskGroups[j].tasks[l].image,
                  completed: oldGenshinDailiesData.characters[i].taskGroups[j].tasks[k].completed,
                  enabled: oldGenshinDailiesData.characters[i].taskGroups[j].tasks[k].enabled,
                  type: newGenshinDailiesStructure.characters[i].taskGroups[j].tasks[l].type,
                  displayCondition: newGenshinDailiesStructure.characters[i].taskGroups[j].tasks[l].displayCondition
                };
                // add this task to the current dailies structure
                this.genshinDailiesData.characters[i].taskGroups[j].tasks.push(transferTask);

                // remove the new task that was matched with an old existing one
                newGenshinDailiesStructure.characters[i].taskGroups[j].tasks.splice(l, 1);
              }
            }
          }
          // copy all left over new tasks over
          for (let k = 0; k < newGenshinDailiesStructure.characters[i].taskGroups[j].tasks.length; k++) {
            var transferTask: Task = {
              name: newGenshinDailiesStructure.characters[i].taskGroups[j].tasks[k].name,
              image: newGenshinDailiesStructure.characters[i].taskGroups[j].tasks[k].image,
              completed: newGenshinDailiesStructure.characters[i].taskGroups[j].tasks[k].completed,
              enabled: newGenshinDailiesStructure.characters[i].taskGroups[j].tasks[k].enabled,
              type: newGenshinDailiesStructure.characters[i].taskGroups[j].tasks[k].type,
              displayCondition: newGenshinDailiesStructure.characters[i].taskGroups[j].tasks[k].displayCondition
            };
            this.genshinDailiesData.characters[i].taskGroups[j].tasks.push(transferTask);
          }
        }
      }
      // move over other properties including the new version
      this.genshinDailiesData.version = DailiesJson.version;
      this.genshinDailiesData.lastTrackerVisit = Date.now().toString();
      this.genshinDailiesData.selectedCharacterIndex = oldGenshinDailiesData.selectedCharacterIndex;
      this.genshinDailiesData.mapleRegion = oldGenshinDailiesData.mapleRegion;
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
    endTime = endTime - (this.genshinDailiesData.mapleRegion.resetUtcOffset * 60 * 60 * 1000)
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
    this.genshinDailiesData.lastTrackerVisit = (parseInt(Date.now().toString()) + 5000).toString();
    this.changeHandler();
  }

  // This function resets all completed values
  resetCompletedValues() {
    this.genshinDailiesData.characters.forEach(character => {
      character.taskGroups.forEach(taskgroup => {
        taskgroup.tasks.forEach(task => {
          task.completed = false;
        });
      });
    });
  }

  changeHandler() {
    localStorage.setItem("genshinDailiesData", JSON.stringify(this.genshinDailiesData));
    this.checkIfAllGroupsAreDisabled();
  }

  checkIfAllGroupsAreDisabled() {
    this.allGroupsAreDisabled = !this.genshinDailiesData.characters[this.genshinDailiesData.selectedCharacterIndex].taskGroups.some(item => !item.allDisabled);
  }

  regionChangeHandler() {
    this.checkIfDataIsFromPreviousDay();

    this.startTimer();
  }
}