import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverwatchRandomHeroSelectorComponent } from './random-hero-selector/overwatch-random-hero-selector.component';
import { OverwatchRandomHeroSelectorRoutingModule } from './overwatch-random-hero-selector-routing.module';
import { OverwatchSharedModule } from '../../side-navigation/overwatch-shared.module';

@NgModule({
    declarations: [OverwatchRandomHeroSelectorComponent],
    imports: [
        CommonModule,
        OverwatchRandomHeroSelectorRoutingModule,
        OverwatchSharedModule
    ],
    exports: [
        OverwatchRandomHeroSelectorComponent,
    ]
})
export class OverwatchRandomHeroSelectorModule { }
