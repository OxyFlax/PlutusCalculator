import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Region } from '../../Models/region';
import { TaskData } from '../../Models/taskModels';

@Component({
  selector: 'app-task-topbar-editmode',
  templateUrl: './task-topbar-editmode.component.html',
  styleUrls: ['./task-topbar-editmode.component.css']
})
export class TopbarEditmodeComponent implements OnDestroy {
  @Input() taskData: TaskData;
  @Input() topBarTitle: string;
  @Input() regions: Array<Region>;
  
  @Output() changeEvent = new EventEmitter<any>();
  @Output() regionChangeEvent = new EventEmitter<any>();
  @Output() addCharacterEvent = new EventEmitter<any>();


  ngOnDestroy() {
    // should prevent the page from loading in editmode
    this.taskData.editModeActive = false;
    // handle the saving if the user leaves without exiting edit mode
    this.changeHandler();
  }

  regionChange(event: any) {
    this.taskData.mapleRegion = this.regions[event.target.selectedIndex];
    
    // save the region change
    this.changeHandler();

    // trigger a re initialisation to make the timers adjust to the new reset
    this.regionChangeEvent.emit();

    // TODO: potentially add logic that changes this for both the dailies and weeklies to keep it synchronized
  }

  exitEditMode() {
    this.taskData.editModeActive = false;

    // save the task order & enabled changes (this ensures the changes are saved only once instead of with every change)
    this.changeHandler();
  }

  changeHandler() {
    this.changeEvent.emit();
  }

  addCharacterEmitter() {
    this.addCharacterEvent.emit();
  }
}
