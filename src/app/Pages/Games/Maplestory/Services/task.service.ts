import { Injectable } from '@angular/core';
import { concat } from 'rxjs';
import { TaskData, CharacterData, TaskGroup, Task } from "../Models/taskModels";

@Injectable({
    providedIn: 'root',
})

export class TaskService {

    v2v3Updater(oldTaskDataStorageString: string) {
        // fetch the old data
        var stringified = localStorage.getItem(oldTaskDataStorageString);

        // replace the necessary information
        stringified = stringified.split("completed").join("done");
        stringified = stringified.split("displayCondition").join("dispCon");

        // remove the old data from localstorage to not retrigger the updating
        localStorage.removeItem(oldTaskDataStorageString);

        // return the adjusted data
        return JSON.parse(stringified);
    }

    initiateDataSet(json, characterCount: number) {
        var newCharacterData: CharacterData = {
            characterName: "",
            taskGroups: json.taskGroups
        };

        var newTaskDataSet: TaskData = {
            characters: [],
            version: json.version,
            lastTrackerVisit: Date.now().toString(),
            selectedCharacterIndex: 0,
            mapleRegion: { resetUtcOffset: 0, name: 'GMS' },
            editModeActive: false,
            infoVisible: false,
            imagePrefix: json.imagePrefix
        };

        for (let i = 0; i < characterCount; i++) {
            newCharacterData.characterName = "Char" + (i + 1);
            newTaskDataSet.characters[i] = JSON.parse(JSON.stringify(newCharacterData));
        };
        return newTaskDataSet;
    }

    updateTaskStructure(oldTaskData: TaskData, json) {

        // create the new taskData which will be returned once everything has been checked and moved over
        var newTaskData: TaskData = this.initiateDataSet(json, oldTaskData.characters.length);
        // initiate a new dataset to use as comparrison for which tasks still exist and which are removed
        var newTaskStructure: TaskData = this.initiateDataSet(json, oldTaskData.characters.length);

        for (let i = 0; i < oldTaskData.characters.length; i++) {
            // move over the name
            newTaskData.characters[i].characterName = oldTaskData.characters[i].characterName;

            // check if there are more task groups in the new data (aka if a new group is added). As the for loop bases it self on the new taskgroup length it will error out if it does not exist in the old data.
            if (newTaskData.characters[i].taskGroups.length > oldTaskData.characters[i].taskGroups.length) {
                // extract all new taskgroups from the newtaskdata list.
                var newTaskGroups = newTaskData.characters[i].taskGroups.slice(oldTaskData.characters[i].taskGroups.length);

                // add all extra taskgroups to the old taskdata
                for (let j = 0; j < newTaskGroups.length; j++) {
                    oldTaskData.characters[i].taskGroups.push(newTaskGroups[j]);
                }
            }

            // loop through all the taskgroups for the character
            for (let j = 0; j < newTaskData.characters[i].taskGroups.length; j++) {
                // clear the tasks (the old/new data will pushed this array)
                newTaskData.characters[i].taskGroups[j].tasks = [];

                // loop through all old tasks from the taskgroup
                for (let k = 0; k < oldTaskData.characters[i].taskGroups[j].tasks.length; k++) {
                    // if the type of the old task is "custom" it is a custom task and should be moved to the new structure
                    if (oldTaskData.characters[i].taskGroups[j].tasks[k].type == "custom") {
                        // If the string contains custom.png it means the user didn't give an image url
                        // If this is the case set the value to the new custom task icon path
                        if (oldTaskData.characters[i].taskGroups[j].tasks[k].image.includes('ustom.png')) {
                            oldTaskData.characters[i].taskGroups[j].tasks[k].image = "assets/TrackerImages/Custom.png";
                        }
                        newTaskData.characters[i].taskGroups[j].tasks.push(oldTaskData.characters[i].taskGroups[j].tasks[k]);
                        continue;
                    }

                    // if the old task isn't custom verify if it still exists in the new dailies structure if it does move it
                    for (let l = 0; l < newTaskStructure.characters[i].taskGroups[j].tasks.length; l++) {
                        if (oldTaskData.characters[i].taskGroups[j].tasks[k].name == newTaskStructure.characters[i].taskGroups[j].tasks[l].name) {
                            // transfer the name, completed & enabled values from olddailies and image from the new structure into a temporary object
                            var transferTask: Task = {
                                name: oldTaskData.characters[i].taskGroups[j].tasks[k].name,
                                image: newTaskStructure.characters[i].taskGroups[j].tasks[l].image,
                                done: oldTaskData.characters[i].taskGroups[j].tasks[k].done,
                                enabled: oldTaskData.characters[i].taskGroups[j].tasks[k].enabled,
                                type: newTaskStructure.characters[i].taskGroups[j].tasks[l].type,
                                dispCon: newTaskStructure.characters[i].taskGroups[j].tasks[l].dispCon
                            };
                            // add this task to the current dailies structure
                            newTaskData.characters[i].taskGroups[j].tasks.push(transferTask);

                            // remove the new task that was matched with an old existing one (slightly improves the speed as the next time the for is called it will have to iterate through one less item)
                            newTaskStructure.characters[i].taskGroups[j].tasks.splice(l, 1);
                        }
                    }
                }
                // copy all left over new tasks over
                for (let k = 0; k < newTaskStructure.characters[i].taskGroups[j].tasks.length; k++) {
                    newTaskData.characters[i].taskGroups[j].tasks.push(newTaskStructure.characters[i].taskGroups[j].tasks[k]);
                }
            }
        }
        // move over the other properties
        newTaskData.lastTrackerVisit = Date.now().toString();
        newTaskData.selectedCharacterIndex = oldTaskData.selectedCharacterIndex;
        newTaskData.mapleRegion = oldTaskData.mapleRegion;
        newTaskData.infoVisible = true

        return newTaskData;
    }

    addCharacter(data: TaskData, json) {
        var newCharacterData: CharacterData = {
            characterName: "",
            taskGroups: json.taskGroups
        };

        var charNumber = data.characters.length + 1;
        newCharacterData.characterName = "Char" + charNumber;

        // stringify and parse to ensure the data is passed by value not by reference
        // without this all newly added characters would be a reference of eachother
        return data.characters.push(JSON.parse(JSON.stringify(newCharacterData)));
    }

    resetCompletionAll(data: TaskData) {
        data.characters.forEach(character => {
            character.taskGroups.forEach(taskgroup => {
                taskgroup.tasks.forEach(task => {
                    task.done = false;
                });
            });
        });

        return data
    }

    resetCompletionIndex(data: TaskData, index: number) {
        data.characters.forEach(character => {
            character.taskGroups[index].tasks.forEach(task => {
                task.done = false;
            });
        });

        return data
    }
}
