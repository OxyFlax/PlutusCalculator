import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestoryDailiesComponent } from './dailies/maplestory-dailies.component';

const routes: Routes = [
    { path: '', component: MaplestoryDailiesComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestoryDailiesRoutingModule { }