import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryWeekliesV3RoutingModule } from './maplestory-weeklies-v3-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';
import { MaplestoryWeekliesV3Component } from './weeklies-v3/maplestory-weeklies-v3.component';
import { MaplestoryTrackerSharedModule } from '../../side-navigation/maplestory-tracker-shared.module';

@NgModule({
    declarations: [MaplestoryWeekliesV3Component],
    imports: [CommonModule, MaplestoryWeekliesV3RoutingModule, MaplestorySharedModule, MaplestoryTrackerSharedModule],
    exports: [MaplestoryWeekliesV3Component, MaplestoryTrackerSharedModule]
})
export class MaplestoryWeekliesV3Module { }
