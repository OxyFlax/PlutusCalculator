import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../Models/trackerData';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  @Input() task: Task;
  editMode: boolean = false;
  @Input() title: string;
  @Input() index: number;
  @Input() imagePrefix: string;

  @Output() disableEvent = new EventEmitter<any>();
  @Output() moveEvent = new EventEmitter<any>();
  @Output() changeEvent = new EventEmitter<any>();

  disableTask() {
    // don't emit the event if editmode isn't active
    if (this.editMode) {
      this.disableEvent.emit(this.index);
    }
  }

  moveTask(direction: string) {
    this.moveEvent.emit({ index: this.index, direction: direction });
  }

  changeHandler() {
    this.changeEvent.emit();
  }

  evaluateDisplayCondition(condition: string) {
    try {
      return eval(condition);
    } catch (e) {
      return true;
    }
  }
}
