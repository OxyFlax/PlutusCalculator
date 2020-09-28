import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiddenTimerComponent } from './timer/hidden-timer.component';
import { HiddenTimerRoutingModule } from './hidden-timer-routing.module';
import { HiddenSharedModule } from '../../side-navigation/hidden-shared.module';

@NgModule({
    declarations: [HiddenTimerComponent],
    imports: [CommonModule, HiddenTimerRoutingModule, HiddenSharedModule],
    exports: [HiddenTimerComponent]
})
export class HiddenTimerModule { }
