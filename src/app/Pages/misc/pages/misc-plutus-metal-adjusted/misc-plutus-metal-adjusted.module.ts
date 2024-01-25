import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscPlutusMetalAdjustedComponent } from './plutus-metal-adjusted/misc-plutus-metal-adjusted.component';
import { MiscPlutusMetalAdjustedRoutingModule } from './misc-plutus-metal-adjusted-routing.module';
import { SharedModule } from '../../../../Shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [MiscPlutusMetalAdjustedComponent],
    imports: [CommonModule, SharedModule, MiscPlutusMetalAdjustedRoutingModule, NgSelectModule, FormsModule],
    exports: [MiscPlutusMetalAdjustedComponent]
})
export class MiscPlutusMetalAdjustedModule { }
