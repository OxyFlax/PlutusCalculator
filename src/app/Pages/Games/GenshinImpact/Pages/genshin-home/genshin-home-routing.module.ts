import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenshinHomeComponent } from './home/genshin-home.component';

const routes: Routes = [
    { path: '', component: GenshinHomeComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GenshinHomeRoutingModule { }