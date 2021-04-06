import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestorySettingsComponent } from './settings/maplestory-settings.component';
import { MaplestorySettingsRoutingModule } from './maplestory-settings-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';

@NgModule({
    declarations: [MaplestorySettingsComponent],
    imports: [
        CommonModule,
        MaplestorySettingsRoutingModule,
        MaplestorySharedModule
    ],
    exports: [
        MaplestorySettingsComponent,
    ]
})
export class MaplestorySettingsModule { }
