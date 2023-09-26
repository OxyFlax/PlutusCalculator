import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscPlutusMetalAdjustedComponent } from './plutus-metal-adjusted/misc-plutus-metal-adjusted.component';
import { MiscPlutusMetalAdjustedRoutingModule } from './misc-plutus-metal-adjusted-routing.module';
import { SharedModule } from '../../../../Shared/shared.module';

@NgModule({
    declarations: [MiscPlutusMetalAdjustedComponent],
    imports: [CommonModule, SharedModule, MiscPlutusMetalAdjustedRoutingModule],
    exports: [MiscPlutusMetalAdjustedComponent]
})
export class MiscPlutusMetalAdjustedModule { }
