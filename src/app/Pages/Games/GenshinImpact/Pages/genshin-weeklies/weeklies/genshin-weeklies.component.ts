import { Component, OnInit, OnDestroy } from '@angular/core';
import WeekliesJson from '../../../../../../../assets/Games/GenshinImpact/Weeklies.json';
import { Meta, Title } from '@angular/platform-browser';
import { Task, TaskData, CharacterData } from '../../../../Maplestory/Models/taskModels';

// When upgrading the trackers from v1 to v2 a function to update the saved data was added.
// This is something that can be removed 2months after the upgrade so as many people as possible are able to enjoy a flawless transition
// Removal possible after: June 21 2021
// In the updatechecker a removal of the "old tracker custom task support" can be done too. Since there has been more than enough time for all old tracker objects to receive the type = custom

@Component({
  selector: 'app-genshin-weeklies',
  templateUrl: './genshin-weeklies.component.html',
  styleUrls: ['./genshin-weeklies.component.css']
})
export class GenshinWeekliesComponent implements OnInit, OnDestroy {
  characterIndex: number = 0;
  genshinWeekliesData: TaskData;
  allGroupsAreDisabled: boolean;

  timers: any[] = [];
  timerStrings: string[] = ["", ""];

  showInfo: boolean;
  
  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Genshin Impact Weeklies Tracker | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "A weeklies tracker for Genshin Impact to keep track of your completed weekly tasks. Keep track of your weeklies across multiple different characters." });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }

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
    if (localStorage.getItem("genshinWeekliesData")) {
      this.genshinWeekliesData = JSON.parse(localStorage.getItem("genshinWeekliesData"));

      // prevents the page from loading in editmode
      this.genshinWeekliesData.editModeActive = false;

      this.updateChecker();
      this.weeklyDataChecker();

      // checks if all groups are disabled to notify users to enable dailies in the editmode
      this.checkIfAllGroupsAreDisabled();
    } else {
      // initiate a dataset
      this.initiateDataSet();
    }

    // 0 starts weekly boss timer, 1 starts weekly task timer
    this.startTimer(0);
    this.startTimer(1);
  }

  initiateDataSet() {
    var newCharacterList: CharacterData = {
      characterName: "",
      taskGroups: [
        { title: 'Weekly Tasks', tasks: WeekliesJson.weeklyTasks, allDisabled: false }
      ]
    };

    var newGenshinWeekliesData: TaskData = {
      characters: [],
      version: WeekliesJson.version,
      lastTrackerVisit: Date.now().toString(),
      selectedCharacterIndex: 0,
      mapleRegion: {resetUtcOffset: 0, name: 'GMS'},
      editModeActive: false
    };

    for (let i = 0; i < 4; i++) {
      newCharacterList.characterName = "Char" + (i + 1);
      newGenshinWeekliesData.characters[i] = JSON.parse(JSON.stringify(newCharacterList));
    };

    this.genshinWeekliesData = newGenshinWeekliesData;
    this.changeHandler();
  }

  weeklyDataChecker() {
    var lastThursday = this.getPreviousDayOfWeek(4);
    var lastMonday = this.getPreviousDayOfWeek(1);

    var lastVisit = parseInt(this.genshinWeekliesData.lastTrackerVisit);

    if (lastVisit < lastThursday) {
      this.resetCompletedValues(0);
    }

    if (lastVisit < lastMonday) {
      this.resetCompletedValues(1);
    }

    this.genshinWeekliesData.lastTrackerVisit = Date.now().toString();
    this.changeHandler();
  }

  getNextDayOfWeek(dayOfWeek) {
    var currentDay = new Date();
    var resultDate = new Date(Date.UTC(currentDay.getUTCFullYear(), currentDay.getUTCMonth(), currentDay.getUTCDate(), 0, 0, 0, 0));

    resultDate.setTime(resultDate.getTime() + (((7 + dayOfWeek - resultDate.getUTCDay() - 1) % 7 + 1) * 24 * 60 * 60 * 1000));

    // calculate the offset from UTC if the time to countdown is in the past it means that a week needs to be added
    // WARNING: countdowns to timezones behind utc might not work properly (Have fun future me if this needs to be added :) )
    var resultDateEpoch = resultDate.valueOf();
    resultDateEpoch = resultDateEpoch - (this.genshinWeekliesData.mapleRegion.resetUtcOffset * 60 * 60 * 1000)

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

  updateChecker() {
    // if the current version doesn't match the new version update the data
    if (this.genshinWeekliesData.version != WeekliesJson.version) {
      // copy the old dailiesData into a var to save them for value transfering
      var oldGenshinWeekliesData: TaskData = JSON.parse(JSON.stringify(this.genshinWeekliesData));
      // load in the new data structure into the dailiesData var to transfer it to a newDailies array for verifying which dailies need to be added or removed
      this.initiateDataSet();
      var newGenshinWeekliesStructure: TaskData = JSON.parse(JSON.stringify(this.genshinWeekliesData));

      for (let i = 0; i < oldGenshinWeekliesData.characters.length; i++) {
        // move over the name
        this.genshinWeekliesData.characters[i].characterName = oldGenshinWeekliesData.characters[i].characterName;
        // loop through all the old taskgroups for the character
        for(let j = 0; j < this.genshinWeekliesData.characters[i].taskGroups.length; j++) {
          // clear the current genshinWeekliesData (the old/new data will be saved to this)
          this.genshinWeekliesData.characters[i].taskGroups[j].tasks = [];

          // loop through all old tasks from the taskgroup
          for(let k = 0; k < oldGenshinWeekliesData.characters[i].taskGroups[j].tasks.length; k++) {
            // if the type of the old task is "custom" or the image is "custom.png" it is a custom task and should be moved to the new structure
            if (oldGenshinWeekliesData.characters[i].taskGroups[j].tasks[k].type == "custom" || oldGenshinWeekliesData.characters[i].taskGroups[j].tasks[k].image == "Custom.png") {
              this.genshinWeekliesData.characters[i].taskGroups[j].tasks.push(oldGenshinWeekliesData.characters[i].taskGroups[j].tasks[k]);
              continue;
            }

            // if the old task isn't custom verify if it still exists in the new weeklies structure if it does move it over
            for (let l = 0; l < newGenshinWeekliesStructure.characters[i].taskGroups[j].tasks.length; l++) {
              if (oldGenshinWeekliesData.characters[i].taskGroups[j].tasks[k].name == newGenshinWeekliesStructure.characters[i].taskGroups[j].tasks[l].name) {
                // transfer the name, completed & enabled values from olddailies and image from the new structure into a temporary object
                var transferTask: Task = {
                  name: oldGenshinWeekliesData.characters[i].taskGroups[j].tasks[k].name ,
                  image: newGenshinWeekliesStructure.characters[i].taskGroups[j].tasks[l].image,
                  completed: oldGenshinWeekliesData.characters[i].taskGroups[j].tasks[k].completed,
                  enabled: oldGenshinWeekliesData.characters[i].taskGroups[j].tasks[k].enabled,
                  type: newGenshinWeekliesStructure.characters[i].taskGroups[j].tasks[l].type,
                  displayCondition: newGenshinWeekliesStructure.characters[i].taskGroups[j].tasks[l].displayCondition
                };
                // add this task to the current dailies structure
                this.genshinWeekliesData.characters[i].taskGroups[j].tasks.push(transferTask);

                // remove the new task that was matched with an old existing one
                newGenshinWeekliesStructure.characters[i].taskGroups[j].tasks.splice(l, 1);
              }
            }
          }
          // copy all left over new tasks over
          for (let k = 0; k < newGenshinWeekliesStructure.characters[i].taskGroups[j].tasks.length; k++) {
            var transferTask: Task = {
              name: newGenshinWeekliesStructure.characters[i].taskGroups[j].tasks[k].name,
              image: newGenshinWeekliesStructure.characters[i].taskGroups[j].tasks[k].image,
              completed: newGenshinWeekliesStructure.characters[i].taskGroups[j].tasks[k].completed,
              enabled: newGenshinWeekliesStructure.characters[i].taskGroups[j].tasks[k].enabled,
              type: newGenshinWeekliesStructure.characters[i].taskGroups[j].tasks[k].type,
              displayCondition: newGenshinWeekliesStructure.characters[i].taskGroups[j].tasks[k].displayCondition
            };
            this.genshinWeekliesData.characters[i].taskGroups[j].tasks.push(transferTask);
          }
        }
      }
      // move over other properties including the new version
      this.genshinWeekliesData.version = WeekliesJson.version;
      this.genshinWeekliesData.lastTrackerVisit = Date.now().toString();
      this.genshinWeekliesData.selectedCharacterIndex = oldGenshinWeekliesData.selectedCharacterIndex;
      this.genshinWeekliesData.mapleRegion = oldGenshinWeekliesData.mapleRegion;
      // save the updated data
      this.changeHandler();
    }
  }

  startTimer(taskGroupIndex: number) {
    clearInterval(this.timers[taskGroupIndex]);

    var endTime;

    // if the index is 0 the reset is for weeklybosses on thursday else it is 1 which is the reset for weeklytasks on sunday
    if(taskGroupIndex == 0) {
      endTime = this.getNextDayOfWeek(4);
    } else {
      endTime = this.getNextDayOfWeek(1);
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

  calculateAndOutPutTimes(distance: number, taskGroupIndex: number) {
    if (distance < 0) {
      this.timerStrings[taskGroupIndex] = "RESET!";
      return;
    }

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.timerStrings[taskGroupIndex] = days + "d " + hours + "h " + minutes + "m " + ("00" + seconds).slice(-2) + "s ";
  }

  liveReset(TaskGroupIndex: number) {
    this.resetCompletedValues(TaskGroupIndex);
    this.startTimer(TaskGroupIndex);
    this.genshinWeekliesData.lastTrackerVisit = (parseInt(Date.now().toString()) + 5000).toString();
    this.changeHandler();
  }

  // This function resets all completed values for a taskgroup based on the given index (0 = bosses, 1 = tasks)
  resetCompletedValues(TaskGroupIndex: number) {
    this.genshinWeekliesData.characters.forEach(character => {
      character.taskGroups[TaskGroupIndex].tasks.forEach(task => {
        task.completed = false;
      });
    });
  }

  changeHandler() {
    localStorage.setItem("genshinWeekliesData", JSON.stringify(this.genshinWeekliesData));
    this.checkIfAllGroupsAreDisabled();
  }

  checkIfAllGroupsAreDisabled() {
    this.allGroupsAreDisabled = !this.genshinWeekliesData.characters[this.genshinWeekliesData.selectedCharacterIndex].taskGroups.some(item => !item.allDisabled);
  }
  
  regionChangeHandler() {
    this.weeklyDataChecker();

    // 0 starts weekly boss timer, 1 starts weekly task timer
    this.startTimer(0);
    this.startTimer(1);
  }
}