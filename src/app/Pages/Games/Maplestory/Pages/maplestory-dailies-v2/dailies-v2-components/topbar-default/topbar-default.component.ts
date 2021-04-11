import { Component, Input } from '@angular/core';
import { DailiesData } from '../../../../Models/dailies';

@Component({
  selector: 'app-topbar-default',
  templateUrl: './topbar-default.component.html',
  styleUrls: ['./topbar-default.component.css']
})
export class TopbarDefaultComponent {
  @Input() dailiesData: DailiesData;
  @Input() topBarTitle: string;
  
  enterEditMode() {
    this.dailiesData.editModeActive = true;
  }
}
