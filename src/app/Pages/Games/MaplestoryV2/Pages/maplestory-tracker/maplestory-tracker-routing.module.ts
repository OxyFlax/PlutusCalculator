import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestoryTrackerComponent } from './tracker/maplestory-tracker.component';

const routes: Routes = [
    { path: '', component: MaplestoryTrackerComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestoryTrackerRoutingModule { }