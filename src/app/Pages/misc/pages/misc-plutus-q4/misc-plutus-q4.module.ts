import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscPlutusQ4Component } from './plutus-q4/misc-plutus-q4.component';
import { MiscPlutusQ4RoutingModule } from './misc-plutus-q4-routing.module';
import { SharedModule } from '../../../../Shared/shared.module';

@NgModule({
    declarations: [MiscPlutusQ4Component],
    imports: [CommonModule, SharedModule, MiscPlutusQ4RoutingModule],
    exports: [MiscPlutusQ4Component]
})
export class MiscPlutusQ4Module { }
