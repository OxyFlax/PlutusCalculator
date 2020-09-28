import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HiddenStopwatchComponent } from './stopwatch/hidden-stopwatch.component';

const routes: Routes = [
    { path: '', component: HiddenStopwatchComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HiddenStopwatchRoutingModule { }