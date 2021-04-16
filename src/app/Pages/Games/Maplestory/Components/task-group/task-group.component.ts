import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskData, TaskGroup } from '../../Models/taskModels';

@Component({
  selector: 'app-task-group',
  templateUrl: './task-group.component.html',
  styleUrls: ['./task-group.component.css']
})
export class TaskGroupComponent implements OnInit {
  @Input() taskData: TaskData; // reference is passed along to make editModeActive available without requiring an event emitter if it gets changed
  @Input() taskGroup: TaskGroup;
  @Input() title: string;
  @Input() timerString: string;

  @Output() changeEvent = new EventEmitter<any>();

  allTasksDisabled: boolean = false;
  addingCustomTask: boolean = false;

  ngOnInit() {
    this.checkIfGroupIsFullyDisabled();
  }

  moveTask(event: any) {
    if (event.direction == "up") {
      if (event.index == 0) {
        return;
      }
      var temp = this.taskGroup.tasks[event.index - 1];
      this.taskGroup.tasks[event.index - 1] = this.taskGroup.tasks[event.index];
      this.taskGroup.tasks[event.index] = temp;
    }

    if (event.direction == "down") {
      if (event.index + 1 == this.taskGroup.tasks.length) {
        return;
      }
      var temp = this.taskGroup.tasks[event.index + 1];
      this.taskGroup.tasks[event.index + 1] = this.taskGroup.tasks[event.index];
      this.taskGroup.tasks[event.index] = temp;
    }
  }

  disableTask(index: any) {
    if (this.taskGroup.tasks[index].type == "custom" || this.taskGroup.tasks[index].image == "Custom.png") {
      this.taskGroup.tasks.splice(index, 1);
      return;
    }

    if (this.taskGroup.tasks[index].enabled) {
      this.taskGroup.tasks[index].enabled = false;
    } else {
      this.taskGroup.tasks[index].enabled = true;
    }

    this.checkIfGroupIsFullyDisabled();
  }

  evaluateDisplayCondition(condition: string) {
    try {
      return eval(condition);
    } catch (e) {
      return true;
    }
  }

  checkIfGroupIsFullyDisabled() {
    if (this.taskGroup.tasks.some(item => item.enabled)) {
      this.taskGroup.allDisabled = false;
    } else {
      this.taskGroup.allDisabled = true;
    }
    this.changeHandler();
  }

  customTaskStartAdding() {
    this.addingCustomTask = true;
  }

  customTaskConfirmAdding(eventData: any) {
      this.taskGroup.tasks.push(eventData);
      this.addingCustomTask = false;
      this.checkIfGroupIsFullyDisabled();
      this.changeHandler();
  }

  customTaskCancelAdding() {
    this.addingCustomTask = false;
  }

  changeHandler() {
    this.changeEvent.emit();
  }
}
