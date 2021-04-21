import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestoryWeekliesV1Component } from './weeklies/maplestory-weeklies-v1.component';

const routes: Routes = [
    { path: '', component: MaplestoryWeekliesV1Component }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestoryWeekliesV1RoutingModule { }