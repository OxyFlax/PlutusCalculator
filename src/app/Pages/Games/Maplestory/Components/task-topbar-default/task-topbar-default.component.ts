import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskData } from '../../Models/taskModels';

@Component({
  selector: 'app-task-topbar-default',
  templateUrl: './task-topbar-default.component.html',
  styleUrls: ['./task-topbar-default.component.css']
})
export class TopbarDefaultComponent {
  @Input() taskData: TaskData;
  @Input() topBarTitle: string;
  @Input() editButtonTitle: string;

  @Output() changeEvent = new EventEmitter<any>();
  
  enterEditMode() {
    this.taskData.editModeActive = true;
    this.changeHandler();
  }

  changeHandler() {
    this.changeEvent.emit();
  }
}
