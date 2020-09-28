import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverwatchHomeComponent } from './home/overwatch-home.component';

const routes: Routes = [
    { path: '', component: OverwatchHomeComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OverwatchHomeRoutingModule { }