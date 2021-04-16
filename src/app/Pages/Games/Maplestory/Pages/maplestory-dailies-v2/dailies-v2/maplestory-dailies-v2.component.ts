import { Component, OnInit, OnDestroy } from '@angular/core';
import DailiesJson from '../../../../../../../assets/Games/Maplestory/Dailies.json';
import { Meta, Title } from '@angular/platform-browser';
import { TaskData, CharacterData } from '../../../Models/taskModels';

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
  
  constructor(private titleService: Title, private metaService: Meta) { }

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
    if (localStorage.getItem("dailiesData")) {
      this.dailiesData = JSON.parse(localStorage.getItem("dailiesData"));

      // prevents the page from loading in editmode
      this.dailiesData.editModeActive = false;

      this.checkIfDataIsFromPreviousDay();
      // this.updateChecker();

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
      editModeActive: false,
      mapleRegion: {resetUtcOffset: 0, name: 'GMS'}
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
          task.completed = false;
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
}