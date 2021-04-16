import { Component, OnInit, OnDestroy } from '@angular/core';
import WeekliesJson from '../../../../../../../assets/Games/Maplestory/Weeklies.json';
import { Meta, Title } from '@angular/platform-browser';
import { TaskData, CharacterData } from '../../../Models/taskModels';

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

      this.weeklyDataChecker();
      // this.updateChecker();

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
      editModeActive: false,
      mapleRegion: {resetUtcOffset: 0, name: 'GMS'}
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

  // updateChecker() {
  //   // if the current version doesn't match the new version update the data
  //   if (localStorage.getItem("dailiesVersion") != DailiesJson.version) {
  //     // copy the old dailies into a var to save them for value transfering
  //     var oldDailies: CharacterData[] = JSON.parse(localStorage.getItem("dailies"));
  //     // load in the new data structure into the dailies var to transfer it to a newDailies array for verifying which dailies need to be added or removed
  //     this.initiateData();
  //     var newDailiesStructure: CharacterData[] = JSON.parse(JSON.stringify(this.dailies));

  //     for (let i = 0; i < this.dailies.length; i++) {
  //       // move over the name
  //       this.dailies[i].characterName = oldDailies[i].characterName;

  //       // update daily bosses
  //       this.dailies[i].dailyBosses = [];
  //       // copy over all data from dailybosses that still exist in the new structure
  //       for (let j = 0; j < oldDailies[i].dailyBosses.length; j++) {
  //         // if the image of the old task is custom.png its a custom task and should be moved over to the new structure
  //         if (oldDailies[i].dailyBosses[j].type == "custom" || oldDailies[i].dailyBosses[j].image == "Custom.png") {
  //           // if it doesn't have the type attribute due to being a custom daily from before the addition of the type system
  //           oldDailies[i].dailyBosses[j]["type"] = "custom";
  //           // if the custom image url = "Custom.png" change this to a diffrent url for compatability with the new system
  //           if (oldDailies[i].dailyBosses[j]["image"] == "Custom.png") {
  //             oldDailies[i].dailyBosses[j]["image"] = "assets/Games/Maplestory/Dailies/" + "Custom.png";
  //           }
  //           this.dailies[i].dailyBosses.push(oldDailies[i].dailyBosses[j]);
  //           continue;
  //         }

  //         for (let k = 0; k < newDailiesStructure[i].dailyBosses.length; k++) {
  //           if (oldDailies[i].dailyBosses[j].name == newDailiesStructure[i].dailyBosses[k].name) {
  //             // transfer the name, completed & enabled values from olddailies and image from the new structure into a temporary object
  //             var transferTask: Task = {
  //               name: oldDailies[i].dailyBosses[j].name,
  //               image: newDailiesStructure[i].dailyBosses[k].image,
  //               completed: oldDailies[i].dailyBosses[j].completed,
  //               enabled: oldDailies[i].dailyBosses[j].enabled,
  //               type: newDailiesStructure[i].dailyBosses[k].type,
  //               displayCondition: newDailiesStructure[i].dailyBosses[k].displayCondition
  //             };
  //             // add this task to the current dailies structure
  //             this.dailies[i].dailyBosses.push(transferTask);
  //             newDailiesStructure[i].dailyBosses.splice(k, 1);
  //           }
  //         }
  //       }
  //       // copy all left over new dailybosses over
  //       for (let j = 0; j < newDailiesStructure[i].dailyBosses.length; j++) {
  //         var transferTask: Task = {
  //           name: newDailiesStructure[i].dailyBosses[j].name,
  //           image: newDailiesStructure[i].dailyBosses[j].image,
  //           completed: newDailiesStructure[i].dailyBosses[j].completed,
  //           enabled: newDailiesStructure[i].dailyBosses[j].enabled,
  //           type: newDailiesStructure[i].dailyBosses[j].type,
  //           displayCondition: newDailiesStructure[i].dailyBosses[j].displayCondition
  //         };
  //         this.dailies[i].dailyBosses.push(transferTask);
  //       }

  //       // update daily tasks
  //       this.dailies[i].dailyTasks = [];
  //       // copy over all data from dailytasks that still exist in the new structure
  //       for (let j = 0; j < oldDailies[i].dailyTasks.length; j++) {
  //         // if the image of the old task is custom.png its a custom task and should be moved over to the new structure
  //         if (oldDailies[i].dailyTasks[j].type == "custom" || oldDailies[i].dailyTasks[j].image == "Custom.png") {
  //           // if it doesn't have the type attribute due to being a custom daily from before the addition of the type system
  //           oldDailies[i].dailyTasks[j]["type"] = "custom";
  //           // if the custom image url = "Custom.png" change this to a diffrent url for compatability with the new system
  //           if (oldDailies[i].dailyTasks[j]["image"] == "Custom.png") {
  //             oldDailies[i].dailyTasks[j]["image"] = "assets/Games/Maplestory/Dailies/" + "Custom.png";
  //           }
  //           this.dailies[i].dailyTasks.push(oldDailies[i].dailyTasks[j]);
  //           continue;
  //         }

  //         for (let k = 0; k < newDailiesStructure[i].dailyTasks.length; k++) {
  //           if (oldDailies[i].dailyTasks[j].name == newDailiesStructure[i].dailyTasks[k].name) {
  //             // transfer the name, completed & enabled values from olddailies and image from the new structure into a temporary object
  //             var transferTask: Task = {
  //               name: oldDailies[i].dailyTasks[j].name,
  //               image: newDailiesStructure[i].dailyTasks[k].image,
  //               completed: oldDailies[i].dailyTasks[j].completed,
  //               enabled: oldDailies[i].dailyTasks[j].enabled,
  //               type: newDailiesStructure[i].dailyTasks[k].type,
  //               displayCondition: newDailiesStructure[i].dailyTasks[k].displayCondition
  //             };
  //             // add this task to the current dailies structure
  //             this.dailies[i].dailyTasks.push(transferTask);
  //             newDailiesStructure[i].dailyTasks.splice(k, 1);
  //           }
  //         }
  //       }
  //       // copy all left over new daily tasks over
  //       for (let j = 0; j < newDailiesStructure[i].dailyTasks.length; j++) {
  //         var transferTask: Task = {
  //           name: newDailiesStructure[i].dailyTasks[j].name,
  //           image: newDailiesStructure[i].dailyTasks[j].image,
  //           completed: newDailiesStructure[i].dailyTasks[j].completed,
  //           enabled: newDailiesStructure[i].dailyTasks[j].enabled,
  //           type: newDailiesStructure[i].dailyTasks[j].type,
  //           displayCondition: newDailiesStructure[i].dailyTasks[j].displayCondition
  //         };
  //         this.dailies[i].dailyTasks.push(transferTask);
  //       }

  //       // update daily arcaneriver
  //       this.dailies[i].dailyArcaneRiver = [];
  //       // copy over all data from dailyarcaneriver that still exist in the new structure
  //       for (let j = 0; j < oldDailies[i].dailyArcaneRiver.length; j++) {
  //         // if the image of the old task is custom.png its a custom task and should be moved over to the new structure
  //         if (oldDailies[i].dailyArcaneRiver[j].type == "custom" || oldDailies[i].dailyArcaneRiver[j].image == "Custom.png") {
  //           // if it doesn't have the type attribute due to being a custom daily from before the addition of the type system
  //           oldDailies[i].dailyArcaneRiver[j]["type"] = "custom";
  //           // if the custom image url = "Custom.png" change this to a diffrent url for compatability with the new system
  //           if (oldDailies[i].dailyArcaneRiver[j]["image"] == "Custom.png") {
  //             oldDailies[i].dailyArcaneRiver[j]["image"] = "assets/Games/Maplestory/Dailies/" + "Custom.png";
  //           }
  //           this.dailies[i].dailyArcaneRiver.push(oldDailies[i].dailyArcaneRiver[j]);
  //           continue;
  //         }

  //         for (let k = 0; k < newDailiesStructure[i].dailyArcaneRiver.length; k++) {
  //           if (oldDailies[i].dailyArcaneRiver[j].name == newDailiesStructure[i].dailyArcaneRiver[k].name) {
  //             // transfer the name, completed & enabled values from olddailies and image from the new structure into a temporary object
  //             var transferTask: Task = {
  //               name: oldDailies[i].dailyArcaneRiver[j].name,
  //               image: newDailiesStructure[i].dailyArcaneRiver[k].image,
  //               completed: oldDailies[i].dailyArcaneRiver[j].completed,
  //               enabled: oldDailies[i].dailyArcaneRiver[j].enabled,
  //               type: newDailiesStructure[i].dailyArcaneRiver[k].type,
  //               displayCondition: newDailiesStructure[i].dailyArcaneRiver[k].displayCondition
  //             };
  //             // add this task to the current dailies structure
  //             this.dailies[i].dailyArcaneRiver.push(transferTask);
  //             newDailiesStructure[i].dailyArcaneRiver.splice(k, 1);
  //           }
  //         }
  //       }
  //       // copy all left over new dailyarcaneriver over
  //       for (let j = 0; j < newDailiesStructure[i].dailyArcaneRiver.length; j++) {
  //         var transferTask: Task = {
  //           name: newDailiesStructure[i].dailyArcaneRiver[j].name,
  //           image: newDailiesStructure[i].dailyArcaneRiver[j].image,
  //           completed: newDailiesStructure[i].dailyArcaneRiver[j].completed,
  //           enabled: newDailiesStructure[i].dailyArcaneRiver[j].enabled,
  //           type: newDailiesStructure[i].dailyArcaneRiver[j].type,
  //           displayCondition: newDailiesStructure[i].dailyArcaneRiver[j].displayCondition
  //         };
  //         this.dailies[i].dailyArcaneRiver.push(transferTask);
  //       }
  //     }
  //     // save the updated data
  //     this.taskChangeHandler();
  //     // update the saved version to the current one
  //     localStorage.setItem("dailiesVersion", DailiesJson.version);
  //   }
  // }

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