import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscSkribblComponent } from './skribbl/misc-skribbl.component';
import { MiscSkribblRoutingModule } from './misc-skribbl-routing.module';
import { SharedModule } from '../../../../Shared/shared.module';

@NgModule({
    declarations: [MiscSkribblComponent],
    imports: [CommonModule, SharedModule, MiscSkribblRoutingModule],
    exports: [MiscSkribblComponent]
})
export class MiscSkribblModule { }
