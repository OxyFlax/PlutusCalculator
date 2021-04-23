import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenshinWeekliesRoutingModule } from './genshin-weeklies-routing.module';
import { GenshinSharedModule } from '../../side-navigation/genshin-shared.module';
import { GenshinWeekliesComponent } from './weeklies/genshin-weeklies.component';
import { MaplestoryTrackerSharedModule } from '../../../Maplestory/side-navigation/maplestory-tracker-shared.module';

@NgModule({
    declarations: [GenshinWeekliesComponent],
    imports: [CommonModule, GenshinWeekliesRoutingModule, GenshinSharedModule, MaplestoryTrackerSharedModule],
    exports: [GenshinWeekliesComponent, MaplestoryTrackerSharedModule]
})
export class GenshinWeekliesModule { }
