import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryDailiesV2Component } from './dailies-v2/maplestory-dailies-v2.component';
import { MaplestoryDailiesV2RoutingModule } from './maplestory-dailies-v2-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';
import { MaplestoryTrackerSharedModule } from '../../side-navigation/maplestory-tracker-shared.module';


@NgModule({
    declarations: [MaplestoryDailiesV2Component],
    imports: [CommonModule, MaplestoryDailiesV2RoutingModule, MaplestorySharedModule, MaplestoryTrackerSharedModule],
    exports: [MaplestoryDailiesV2Component, MaplestoryTrackerSharedModule]
})
export class MaplestoryDailiesV2Module { }
