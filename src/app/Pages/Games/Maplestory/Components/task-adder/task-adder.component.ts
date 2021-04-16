import { Component, EventEmitter, Output } from '@angular/core';
import { Task } from '../../Models/taskModels';

@Component({
  selector: 'app-task-adder',
  templateUrl: './task-adder.component.html',
  styleUrls: ['./task-adder.component.css']
})
export class TaskAdderComponent {
  @Output() cancelAddingTaskEvent = new EventEmitter<string>();
  @Output() confirmAddingTaskEvent = new EventEmitter<any>();

  customTaskName: string = "";
  customTaskImageUrl: string = "";

  confirmAddingCustomTask() {
    if (this.customTaskName != "") {
      // if the user didn't specify an url set it to the default icon
      if (this.customTaskImageUrl == "") {
        this.customTaskImageUrl = "assets/Games/Maplestory/Tracker/Custom.png";
      }

      var newTask: Task = {
        name: this.customTaskName,
        image: this.customTaskImageUrl,
        completed: false,
        enabled: true,
        type: "custom",
        displayCondition: "true"
      }

      this.confirmAddingTaskEvent.emit(newTask);
    } else {
      this.cancelAddingCustomTask();
    }
  }

  cancelAddingCustomTask() {
    this.cancelAddingTaskEvent.emit();
  }
}
