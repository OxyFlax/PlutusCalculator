import { Component, EventEmitter, Output } from '@angular/core';

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
    this.confirmAddingTaskEvent.emit({name: this.customTaskName, imageUrl: this.customTaskImageUrl});
  }

  cancelAddingCustomTask() {
    this.cancelAddingTaskEvent.emit();
  }
}
