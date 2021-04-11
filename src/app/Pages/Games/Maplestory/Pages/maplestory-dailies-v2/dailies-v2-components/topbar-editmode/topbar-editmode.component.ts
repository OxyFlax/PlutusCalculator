import { Component, Input } from '@angular/core';
import { DailiesData } from '../../../../Models/dailies';
import { Region } from '../../../../Models/region';

@Component({
  selector: 'app-topbar-editmode',
  templateUrl: './topbar-editmode.component.html',
  styleUrls: ['./topbar-editmode.component.css']
})
export class TopbarEditmodeComponent {
  @Input() dailiesData: DailiesData;
  @Input() topBarTitle: string;
  

  regions: Array<Region> = [
    { resetUtcOffset: 0, name: 'GMS' },
    { resetUtcOffset: 8, name: 'MSEA' },
    { resetUtcOffset: 9, name: 'KMS' }
  ];

  regionChange(event: any) {
    this.dailiesData.mapleRegion = this.regions[event.target.selectedIndex];



    // TODO: output this as a special event that redo's timers.
    // re do the checks for previous day data & setup the timers for the new resetUtcOffset
    // this.initialise();
  }

  exitEditMode() {
    this.dailiesData.editModeActive = false;
  }

}
