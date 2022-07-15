import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestoryWeekliesV3Component } from './weeklies-v3/maplestory-weeklies-v3.component';

const routes: Routes = [
    { path: '', component: MaplestoryWeekliesV3Component }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestoryWeekliesV3RoutingModule { }