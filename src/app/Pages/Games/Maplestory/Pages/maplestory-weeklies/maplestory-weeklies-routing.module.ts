import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestoryWeekliesComponent } from './weeklies/maplestory-weeklies.component';

const routes: Routes = [
    { path: '', component: MaplestoryWeekliesComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestoryWeekliesRoutingModule { }