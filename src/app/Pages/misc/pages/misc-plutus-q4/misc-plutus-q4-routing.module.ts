import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiscPlutusQ4Component } from './plutus-q4/misc-plutus-q4.component';

const routes: Routes = [
    { path: '', component: MiscPlutusQ4Component }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MiscPlutusQ4RoutingModule { }