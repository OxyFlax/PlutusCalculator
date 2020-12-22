import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiscSkribblComponent } from './skribbl/misc-skribbl.component';

const routes: Routes = [
    { path: '', component: MiscSkribblComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MiscSkribblRoutingModule { }