import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryWeekliesV1Component } from './weeklies/maplestory-weeklies-v1.component';
import { MaplestoryWeekliesV1RoutingModule } from './maplestory-weeklies-v1-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';

@NgModule({
    declarations: [MaplestoryWeekliesV1Component],
    imports: [CommonModule, MaplestoryWeekliesV1RoutingModule, MaplestorySharedModule],
    exports: [MaplestoryWeekliesV1Component]
})
export class MaplestoryWeekliesV1Module { }
