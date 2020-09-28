import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestoryHomeComponent } from './home/maplestory-home.component';

const routes: Routes = [
    { path: '', component: MaplestoryHomeComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestoryHomeRoutingModule { }