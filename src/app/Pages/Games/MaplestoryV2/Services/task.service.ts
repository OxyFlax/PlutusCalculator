import { Injectable } from '@angular/core';
import DailiesJsonV2 from '../../../../../assets/Games/Maplestory/DailiesV2.json';
import WeekliesJsonV2 from '../../../../../assets/Games/Maplestory/WeekliesV2.json';
import { TaskGroup, Task } from "../Models/trackerData";
import { GeneralData } from '../Models/generalData';
import { CharacterData } from '../Models/characterData';

@Injectable({
    providedIn: 'root',
})

export class TaskService {

    dailyUpdateChecker(generalData: GeneralData) {
        if (DailiesJsonV2.version !== generalData.trackerInfo.dailyVersion) {
            this.updateDailyTaskStructure(generalData);
            console.log("did updating");
            generalData.trackerInfo.dailyVersion = DailiesJsonV2.version;
            localStorage.setItem("generalData", JSON.stringify(generalData));
        }
    }

    updateDailyTaskStructure(generalData: GeneralData) {
        for (let i = 0; i < generalData.characters.length; i++) {
            var characterData: CharacterData = JSON.parse(localStorage.getItem(generalData.characters[i].characterStorageReference));
            // make a copy as this has data being removed from it so it needs refreshing
            var newTaskGroups: TaskGroup [] = DailiesJsonV2.taskGroups;

            // TODO: in future if a new taskgroup is added make sure this is done
            // check if there are more task groups in the new data (aka if a new group is added). As the for loop bases it self on the new taskgroup length it will error out if it does not exist in the old data.

            for (let j = 0; j < characterData.dailyTaskGroups.length; j++) {
                characterData.dailyTaskGroups[j] =  this.updateTaskGroup(characterData.dailyTaskGroups[j], newTaskGroups[j]);
            }

            // save the updated data for this character
            localStorage.setItem(generalData.characters[i].characterStorageReference, JSON.stringify(characterData));
        }
    }

    updateTaskGroup(oldTaskGroup: TaskGroup, newTaskGroup: TaskGroup) {
        var transferTaskGroup: TaskGroup = {
            title: newTaskGroup.title,
            tasks: [],
            allDisabled: false
        };

        // loop through all old tasks for the provided task group
        for (let i = 0; i < oldTaskGroup.tasks.length; i++) {
            // if it's a custom task, move it over and move to the next iteration of the for loop
            if (oldTaskGroup.tasks[i].type === "custom") {
                transferTaskGroup.tasks.push(oldTaskGroup.tasks[i]);
                continue;
            }

            // if the old task isn't custom verify if it still exists in the new dailies structure if it does move it
            for (let j = 0; j < newTaskGroup.tasks.length; j++) {
                if (oldTaskGroup.tasks[i].name === newTaskGroup.tasks[j].name) {
                    // transfer the name, completed & enabled values from olddailies and image from the new structure into a temporary object
                    var transferTask: Task = {
                        name: oldTaskGroup.tasks[i].name,
                        image: newTaskGroup.tasks[j].image,
                        done: oldTaskGroup.tasks[i].done,
                        enabled: oldTaskGroup.tasks[i].enabled,
                        type: newTaskGroup.tasks[j].type,
                        dispCon: newTaskGroup.tasks[j].dispCon
                    };

                    transferTaskGroup.tasks.push(transferTask);

                    // remove the new task that was matched with an old existing one (slightly improves the speed as the next time the for is called it will have to iterate through one less item)
                    newTaskGroup.tasks.splice(j, 1);
                }
            }
        }
        // copy all left over new tasks over
        for (let i = 0; i < newTaskGroup.tasks.length; i++) {
            transferTaskGroup.tasks.push(newTaskGroup.tasks[i]);
        }

        return transferTaskGroup;
    }

    resetDailyCompletion(data: GeneralData) {
        data.characters.forEach(character => {
            var characterData = JSON.parse(localStorage.getItem(character.characterStorageReference)) as CharacterData;
            characterData.dailyTaskGroups.forEach(taskgroup => {
                taskgroup.tasks.forEach(task => {
                    task.done = false;
                });
            });
            localStorage.setItem(character.characterStorageReference, JSON.stringify(characterData));
        });
    }

    resetWeeklyCompletionIndex(data: GeneralData, index: number) {
        data.characters.forEach(character => {
            var characterData = JSON.parse(localStorage.getItem(character.characterStorageReference)) as CharacterData;
            characterData.weeklyTaskGroups[index].tasks.forEach(task => {
                task.done = false;
            });
            localStorage.setItem(character.characterStorageReference, JSON.stringify(characterData));
        });
    }
}
