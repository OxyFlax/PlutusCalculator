import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiddenStopwatchComponent } from './stopwatch/hidden-stopwatch.component';
import { HiddenStopwatchRoutingModule } from './hidden-stopwatch-routing.module';
import { HiddenSharedModule } from '../../side-navigation/hidden-shared.module';


@NgModule({
    declarations: [HiddenStopwatchComponent],
    imports: [CommonModule, HiddenStopwatchRoutingModule, HiddenSharedModule],
    exports: [HiddenStopwatchComponent]
})
export class HiddenStopwatchModule { }
