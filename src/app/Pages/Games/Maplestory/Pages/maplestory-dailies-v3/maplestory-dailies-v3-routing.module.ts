import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestoryDailiesV3Component } from './dailies-v3/maplestory-dailies-v3.component';

const routes: Routes = [
    { path: '', component: MaplestoryDailiesV3Component }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestoryDailiesV3RoutingModule { }