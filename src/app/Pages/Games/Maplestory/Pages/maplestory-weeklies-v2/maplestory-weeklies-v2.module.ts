import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryWeekliesV2RoutingModule } from './maplestory-weeklies-v2-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';
import { MaplestoryWeekliesV2Component } from './weeklies-v2/maplestory-weeklies-v2.component';
import { MaplestoryTrackerSharedModule } from '../../side-navigation/maplestory-tracker-shared.module';

@NgModule({
    declarations: [MaplestoryWeekliesV2Component],
    imports: [CommonModule, MaplestoryWeekliesV2RoutingModule, MaplestorySharedModule, MaplestoryTrackerSharedModule],
    exports: [MaplestoryWeekliesV2Component, MaplestoryTrackerSharedModule]
})
export class MaplestoryWeekliesV2Module { }
