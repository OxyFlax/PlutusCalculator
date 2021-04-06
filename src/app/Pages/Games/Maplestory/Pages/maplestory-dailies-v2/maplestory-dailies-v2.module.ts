import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryDailiesV2Component } from './dailies-v2/maplestory-dailies-v2.component';
import { MaplestoryDailiesV2RoutingModule } from './maplestory-dailies-v2-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';
import { TaskGroupComponent } from './dailies-v2-components/task-group/task-group.component';
import { TaskAdderComponent } from './dailies-v2-components/task-adder/task-adder.component';

@NgModule({
    declarations: [MaplestoryDailiesV2Component, TaskGroupComponent, TaskAdderComponent],
    imports: [CommonModule, MaplestoryDailiesV2RoutingModule, MaplestorySharedModule],
    exports: [MaplestoryDailiesV2Component, TaskGroupComponent, TaskAdderComponent]
})
export class MaplestoryDailiesV2Module { }
