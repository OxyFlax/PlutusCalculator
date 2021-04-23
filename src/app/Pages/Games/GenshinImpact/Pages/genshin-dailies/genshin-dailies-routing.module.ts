import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenshinDailiesComponent } from './dailies/genshin-dailies.component';

const routes: Routes = [
    { path: '', component: GenshinDailiesComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GenshinDailiesRoutingModule { }