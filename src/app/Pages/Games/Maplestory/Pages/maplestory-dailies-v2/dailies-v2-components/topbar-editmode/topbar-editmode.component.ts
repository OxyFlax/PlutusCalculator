import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Region } from '../../../../Models/region';
import { TaskData } from '../../../../Models/taskModels';

@Component({
  selector: 'app-topbar-editmode',
  templateUrl: './topbar-editmode.component.html',
  styleUrls: ['./topbar-editmode.component.css']
})
export class TopbarEditmodeComponent implements OnDestroy {
  @Input() taskData: TaskData;
  @Input() topBarTitle: string;
  
  @Output() changeEvent = new EventEmitter<any>();

  regions: Array<Region> = [
    { resetUtcOffset: 0, name: 'GMS' },
    { resetUtcOffset: 8, name: 'MSEA' },
    { resetUtcOffset: 9, name: 'KMS' }
  ];

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

    // TODO: potentially add logic that changes this for both the dailies and weeklies to keep it synchronized

    // TODO: output this as a special event that redo's timers.
    // re do the checks for previous day data & setup the timers for the new resetUtcOffset
    // this.initialise();
    // POTENTIAL WAY: reload the page?
  }

  exitEditMode() {
    this.taskData.editModeActive = false;

    // save the task order & enabled changes (this ensures the changes are saved only once instead of with every change)
    this.changeHandler();
  }

  changeHandler() {
    this.changeEvent.emit();
  }
}
