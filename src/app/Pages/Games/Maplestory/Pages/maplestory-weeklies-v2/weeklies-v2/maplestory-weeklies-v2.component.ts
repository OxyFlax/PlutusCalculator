import { Component, OnInit, OnDestroy } from '@angular/core';
import WeekliesJson from '../../../../../../../assets/Games/Maplestory/Weeklies.json';
import { Meta, Title } from '@angular/platform-browser';
import { TaskData, CharacterData, Task } from '../../../Models/taskModels';

@Component({
  selector: 'app-maplestory-weeklies-v2',
  templateUrl: './maplestory-weeklies-v2.component.html',
  styleUrls: ['./maplestory-weeklies-v2.component.css']
})
export class MaplestoryWeekliesV2Component implements OnInit, OnDestroy {
  characterIndex: number = 0;
  weekliesData: TaskData;
  allGroupsAreDisabled: boolean;

  timers: any[] = [];
  timerStrings: string[] = ["", ""];
  
  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Maplestory Weeklies Tracker | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "A weeklies tracker for Maplestory to keep track of your completed weekly tasks. Keep track of your weeklies across multiple different characters." });
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
    if (localStorage.getItem("weekliesData")) {
      this.weekliesData = JSON.parse(localStorage.getItem("weekliesData"));

      // prevents the page from loading in editmode
      this.weekliesData.editModeActive = false;

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
        { title: 'Weekly Bosses', tasks: WeekliesJson.weeklyBosses, allDisabled: false },
        { title: 'Weekly Tasks', tasks: WeekliesJson.weeklyTasks, allDisabled: false }
      ]
    };

    var newDailiesData: TaskData = {
      characters: [],
      version: WeekliesJson.version,
      lastTrackerVisit: Date.now().toString(),
      selectedCharacterIndex: 0,
      mapleRegion: {resetUtcOffset: 0, name: 'GMS'},
      editModeActive: false
    };

    for (let i = 0; i < 4; i++) {
      newCharacterList.characterName = "Char" + (i + 1);
      newDailiesData.characters[i] = JSON.parse(JSON.stringify(newCharacterList));
    };

    this.weekliesData = newDailiesData;
    this.changeHandler();
  }

  weeklyDataChecker() {
    var lastThursday = this.getPreviousDayOfWeek(4);
    var lastMonday = this.getPreviousDayOfWeek(1);

    var lastVisit = parseInt(this.weekliesData.lastTrackerVisit);

    if (lastVisit < lastThursday) {
      this.resetCompletedValues(0);
    }

    if (lastVisit < lastMonday) {
      this.resetCompletedValues(1);
    }

    this.weekliesData.lastTrackerVisit = Date.now().toString();
    this.changeHandler();
  }

  getNextDayOfWeek(dayOfWeek) {
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

  getPreviousDayOfWeek(dayOfWeek) {
    var resultDate = this.getNextDayOfWeek(dayOfWeek);
    resultDate -= (24 * 60 * 60 * 1000 * 7);
    return resultDate;
  }

  updateChecker() {
    // if the current version doesn't match the new version update the data
    if (this.weekliesData.version != WeekliesJson.version) {
      // copy the old dailiesData into a var to save them for value transfering
      var oldDailiesData: TaskData = JSON.parse(JSON.stringify(this.weekliesData));
      // load in the new data structure into the dailiesData var to transfer it to a newDailies array for verifying which dailies need to be added or removed
      this.initiateDataSet();
      var newDailiesStructure: TaskData = JSON.parse(JSON.stringify(this.weekliesData));

      for (let i = 0; i < oldDailiesData.characters.length; i++) {
        // move over the name
        this.weekliesData.characters[i].characterName = oldDailiesData.characters[i].characterName;
        // loop through all the old taskgroups for the character
        for(let j = 0; j < this.weekliesData.characters[i].taskGroups.length; j++) {
          // clear the current dailiesData (the old/new data will be saved to this)
          this.weekliesData.characters[i].taskGroups[j].tasks = [];

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
              this.weekliesData.characters[i].taskGroups[j].tasks.push(oldDailiesData.characters[i].taskGroups[j].tasks[k]);
              continue;
            }

            // if the old task isn't custom verify if it still exists in the new dailies structure if it does move it over
            for (let l = 0; l < newDailiesStructure.characters[i].taskGroups[j].tasks.length; l++) {
              if (oldDailiesData.characters[i].taskGroups[j].tasks[k].name == newDailiesStructure.characters[i].taskGroups[j].tasks[l].name) {
                // transfer the name, completed & enabled values from olddailies and image from the new structure into a temporary object
                var transferTask: Task = {
                  name: oldDailiesData.characters[i].taskGroups[j].tasks[k].name ,
                  image: newDailiesStructure.characters[i].taskGroups[j].tasks[l].image,
                  completed: oldDailiesData.characters[i].taskGroups[j].tasks[k].completed,
                  enabled: oldDailiesData.characters[i].taskGroups[j].tasks[k].enabled,
                  type: newDailiesStructure.characters[i].taskGroups[j].tasks[l].type,
                  displayCondition: newDailiesStructure.characters[i].taskGroups[j].tasks[l].displayCondition
                };
                // add this task to the current dailies structure
                this.weekliesData.characters[i].taskGroups[j].tasks.push(transferTask);

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
              completed: newDailiesStructure.characters[i].taskGroups[j].tasks[k].completed,
              enabled: newDailiesStructure.characters[i].taskGroups[j].tasks[k].enabled,
              type: newDailiesStructure.characters[i].taskGroups[j].tasks[k].type,
              displayCondition: newDailiesStructure.characters[i].taskGroups[j].tasks[k].displayCondition
            };
            this.weekliesData.characters[i].taskGroups[j].tasks.push(transferTask);
          }
        }
      }
      // move over other properties including the new version
      this.weekliesData.version = WeekliesJson.version;
      this.weekliesData.lastTrackerVisit = Date.now().toString();
      this.weekliesData.selectedCharacterIndex = oldDailiesData.selectedCharacterIndex;
      this.weekliesData.mapleRegion = oldDailiesData.mapleRegion;
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
    this.weekliesData.lastTrackerVisit = (parseInt(Date.now().toString()) + 5000).toString();
    this.changeHandler();
  }

  // This function resets all completed values for a taskgroup based on the given index (0 = bosses, 1 = tasks)
  resetCompletedValues(TaskGroupIndex: number) {
    this.weekliesData.characters.forEach(character => {
      character.taskGroups[TaskGroupIndex].tasks.forEach(task => {
        task.completed = false;
      });
    });
  }

  changeHandler() {
    localStorage.setItem("weekliesData", JSON.stringify(this.weekliesData));
    this.checkIfAllGroupsAreDisabled();
  }

  checkIfAllGroupsAreDisabled() {
    this.allGroupsAreDisabled = !this.weekliesData.characters[this.weekliesData.selectedCharacterIndex].taskGroups.some(item => !item.allDisabled);
  }
  
  regionChangeHandler() {
    this.weeklyDataChecker();

    // 0 starts weekly boss timer, 1 starts weekly task timer
    this.startTimer(0);
    this.startTimer(1);
  }
}