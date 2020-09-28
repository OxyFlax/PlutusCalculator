import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HiddenTimerComponent } from './timer/hidden-timer.component';

const routes: Routes = [
    { path: '', component: HiddenTimerComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HiddenTimerRoutingModule { }