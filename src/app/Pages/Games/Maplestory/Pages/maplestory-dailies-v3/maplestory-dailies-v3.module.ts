import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryDailiesV3Component } from './dailies-v3/maplestory-dailies-v3.component';
import { MaplestoryDailiesV3RoutingModule } from './maplestory-dailies-v3-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';
import { MaplestoryTrackerSharedModule } from '../../side-navigation/maplestory-tracker-shared.module';



@NgModule({
    declarations: [MaplestoryDailiesV3Component],
    imports: [CommonModule, MaplestoryDailiesV3RoutingModule, MaplestorySharedModule, MaplestoryTrackerSharedModule],
    exports: [MaplestoryDailiesV3Component, MaplestoryTrackerSharedModule]
})
export class MaplestoryDailiesV3Module { }
