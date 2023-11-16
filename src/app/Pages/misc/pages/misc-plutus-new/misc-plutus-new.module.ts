import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscPlutusNewComponent } from './plutus-new/misc-plutus-new.component';
import { MiscPlutusNewRoutingModule } from './misc-plutus-new-routing.module';
import { SharedModule } from '../../../../Shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [MiscPlutusNewComponent],
    imports: [CommonModule, SharedModule, MiscPlutusNewRoutingModule, NgSelectModule, FormsModule],
    exports: [MiscPlutusNewComponent]
})
export class MiscPlutusNewModule { }
