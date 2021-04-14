import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskData } from '../../../../Models/taskModels';

@Component({
  selector: 'app-topbar-default',
  templateUrl: './topbar-default.component.html',
  styleUrls: ['./topbar-default.component.css']
})
export class TopbarDefaultComponent {
  @Input() taskData: TaskData;
  @Input() topBarTitle: string;

  @Output() changeEvent = new EventEmitter<any>();
  
  enterEditMode() {
    this.taskData.editModeActive = true;
    this.changeHandler();
  }

  changeHandler() {
    this.changeEvent.emit();
  }
}
