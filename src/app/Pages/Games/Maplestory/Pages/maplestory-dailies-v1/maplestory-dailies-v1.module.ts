import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryDailiesV1Component } from './dailies/maplestory-dailies-v1.component';
import { MaplestoryDailiesV1RoutingModule } from './maplestory-dailies-v1-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';

@NgModule({
    declarations: [MaplestoryDailiesV1Component],
    imports: [CommonModule, MaplestoryDailiesV1RoutingModule, MaplestorySharedModule],
    exports: [MaplestoryDailiesV1Component]
})
export class MaplestoryDailiesV1Module { }
