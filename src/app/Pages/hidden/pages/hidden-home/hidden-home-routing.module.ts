import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HiddenHomeComponent } from './home/hidden-home.component';

const routes: Routes = [
    { path: '', component: HiddenHomeComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HiddenHomeRoutingModule { }