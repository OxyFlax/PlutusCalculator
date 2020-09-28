import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryDailiesComponent } from './dailies/maplestory-dailies.component';
import { MaplestoryDailiesRoutingModule } from './maplestory-dailies-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';

@NgModule({
    declarations: [MaplestoryDailiesComponent],
    imports: [CommonModule, MaplestoryDailiesRoutingModule, MaplestorySharedModule],
    exports: [MaplestoryDailiesComponent]
})
export class MaplestoryDailiesModule { }
