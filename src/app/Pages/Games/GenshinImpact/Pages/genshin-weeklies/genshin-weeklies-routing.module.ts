import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenshinWeekliesComponent } from './weeklies/genshin-weeklies.component';

const routes: Routes = [
    { path: '', component: GenshinWeekliesComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GenshinWeekliesRoutingModule { }