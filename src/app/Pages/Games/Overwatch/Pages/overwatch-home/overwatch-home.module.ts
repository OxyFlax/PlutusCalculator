import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverwatchHomeComponent } from './home/overwatch-home.component';
import { OverwatchHomeRoutingModule } from './overwatch-home-routing.module';
import { OverwatchSharedModule } from '../../side-navigation/overwatch-shared.module';

@NgModule({
    declarations: [OverwatchHomeComponent],
    imports: [
        CommonModule,
        OverwatchHomeRoutingModule,
        OverwatchSharedModule
    ],
    exports: [
        OverwatchHomeComponent,
    ]
})
export class OverwatchHomeModule { }
