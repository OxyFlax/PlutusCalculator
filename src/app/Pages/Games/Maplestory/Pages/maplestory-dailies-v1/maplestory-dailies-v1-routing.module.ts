import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestoryDailiesV1Component } from './dailies/maplestory-dailies-v1.component';

const routes: Routes = [
    { path: '', component: MaplestoryDailiesV1Component }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestoryDailiesV1RoutingModule { }