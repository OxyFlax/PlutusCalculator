import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscPlutusMetalComponent } from './plutus-metal/misc-plutus-metal.component';
import { MiscPlutusMetalRoutingModule } from './misc-plutus-metal-routing.module';
import { SharedModule } from '../../../../Shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [MiscPlutusMetalComponent],
    imports: [CommonModule, SharedModule, MiscPlutusMetalRoutingModule, NgSelectModule, FormsModule],
    exports: [MiscPlutusMetalComponent]
})
export class MiscPlutusMetalModule { }
