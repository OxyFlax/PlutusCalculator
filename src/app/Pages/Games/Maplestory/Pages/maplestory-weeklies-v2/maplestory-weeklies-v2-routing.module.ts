import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestoryWeekliesV2Component } from './weeklies-v2/maplestory-weeklies-v2.component';

const routes: Routes = [
    { path: '', component: MaplestoryWeekliesV2Component }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestoryWeekliesV2RoutingModule { }