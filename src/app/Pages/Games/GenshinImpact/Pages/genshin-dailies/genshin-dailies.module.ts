import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenshinDailiesComponent } from './dailies/genshin-dailies.component';
import { GenshinDailiesRoutingModule } from './genshin-dailies-routing.module';
import { GenshinSharedModule } from '../../side-navigation/genshin-shared.module';
import { MaplestoryTrackerSharedModule } from '../../../Maplestory/side-navigation/maplestory-tracker-shared.module';


@NgModule({
    declarations: [GenshinDailiesComponent],
    imports: [CommonModule, GenshinDailiesRoutingModule, GenshinSharedModule, MaplestoryTrackerSharedModule],
    exports: [GenshinDailiesComponent, MaplestoryTrackerSharedModule]
})
export class GenshinDailiesModule { }
