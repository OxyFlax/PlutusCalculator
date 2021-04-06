import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestoryDailiesV2Component } from './dailies-v2/maplestory-dailies-v2.component';

const routes: Routes = [
    { path: '', component: MaplestoryDailiesV2Component }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestoryDailiesV2RoutingModule { }