import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverwatchRandomHeroSelectorComponent } from './random-hero-selector/overwatch-random-hero-selector.component';

const routes: Routes = [
    { path: '', component: OverwatchRandomHeroSelectorComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OverwatchRandomHeroSelectorRoutingModule { }