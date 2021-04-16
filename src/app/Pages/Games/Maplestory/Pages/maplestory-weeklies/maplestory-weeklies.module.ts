import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryWeekliesComponent } from './weeklies/maplestory-weeklies.component';
import { MaplestoryWeekliesRoutingModule } from './maplestory-weeklies-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';

@NgModule({
    declarations: [MaplestoryWeekliesComponent],
    imports: [CommonModule, MaplestoryWeekliesRoutingModule, MaplestorySharedModule],
    exports: [MaplestoryWeekliesComponent]
})
export class MaplestoryWeekliesModule { }
