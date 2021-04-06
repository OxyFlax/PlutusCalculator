import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../../../../Models/task';

@Component({
  selector: 'app-task-group',
  templateUrl: './task-group.component.html',
  styleUrls: ['./task-group.component.css']
})
export class TaskGroupComponent implements OnInit {
  @Input() tasks: Task[];
  @Input() title: string;
  @Output() taskChangeEvent = new EventEmitter<any>();



  //TODO edit button should trigger the safe, on destroy it should also trigger a save.


  allDailyBossesDisabled: boolean = false;
  editModeActive: boolean = false;
  addingCustomTask: boolean = false;

  ngOnInit(): void {
    console.log(this.tasks);
  }

  moveTask(index: number, direction: string) {
    if (direction == "up") {
      if (index == 0) {
        return;
      }
      var temp = this.tasks[index - 1];
      this.tasks[index - 1] = this.tasks[index];
      this.tasks[index] = temp;
    }

    if (direction == "down") {
      if (index + 1 == this.tasks.length) {
        return;
      }
      var temp = this.tasks[index + 1];
      this.tasks[index + 1] = this.tasks[index];
      this.tasks[index] = temp;
    }
  }

  disableTask(taskIndex: number) {
    if (!this.editModeActive) {
      return;
    }

    if (this.tasks[taskIndex].type == "custom" || this.tasks[taskIndex].image == "Custom.png") {
      this.tasks.splice(taskIndex, 1);
      return;
    }

    if (this.tasks[taskIndex].enabled) {
      this.tasks[taskIndex].enabled = false;
    } else {
      this.tasks[taskIndex].enabled = true;
    }
  }

  startAddingCustomTask() {
    this.addingCustomTask = true;
  }

  cancelAddCustomTask() {
    this.addingCustomTask = false;
  }

  confirmAddingCustomDaily(eventData: any) {
    if (eventData.name != "") {
      // if the user didn't specify an url set it to the default icon
      if (eventData.imageUrl == "") {
        eventData.imageUrl = "assets/Games/Maplestory/Dailies/Custom.png";
      }

      var newTask: Task = {
        name: eventData.name,
        image: eventData.imageUrl,
        completed: false,
        enabled: true,
        type: "custom",
        displayCondition: "true"
      }

      this.tasks.push(newTask);
      this.addingCustomTask = false;
      this.taskChangeHandler();
    }
  }




  evaluateDisplayCondition(condition: string) {
    try {
      return eval(condition);
    } catch (e) {
      return true;
    }
  }

  taskChangeHandler() {
    this.taskChangeEvent.emit();
  }
}
