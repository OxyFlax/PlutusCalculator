import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryTrackerComponent } from './tracker/maplestory-tracker.component';
import { MaplestoryTrackerRoutingModule } from './maplestory-tracker-routing.module';
import { MaplestorySharedModule } from '../../maplestory-shared.module';
import { MaplestoryTrackerSharedModule } from '../../maplestory-tracker-shared.module';



@NgModule({
    declarations: [MaplestoryTrackerComponent],
    imports: [CommonModule, MaplestoryTrackerRoutingModule, MaplestorySharedModule, MaplestoryTrackerSharedModule],
    exports: [MaplestoryTrackerComponent]
})
export class MaplestoryTrackerModule { }
