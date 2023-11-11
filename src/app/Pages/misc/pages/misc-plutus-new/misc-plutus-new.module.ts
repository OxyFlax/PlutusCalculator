import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscPlutusNewComponent } from './plutus-new/misc-plutus-new.component';
import { MiscPlutusNewRoutingModule } from './misc-plutus-new-routing.module';
import { SharedModule } from '../../../../Shared/shared.module';

@NgModule({
    declarations: [MiscPlutusNewComponent],
    imports: [CommonModule, SharedModule, MiscPlutusNewRoutingModule],
    exports: [MiscPlutusNewComponent]
})
export class MiscPlutusNewModule { }
