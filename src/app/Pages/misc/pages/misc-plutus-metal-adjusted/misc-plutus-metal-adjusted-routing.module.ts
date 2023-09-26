import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiscPlutusMetalAdjustedComponent } from './plutus-metal-adjusted/misc-plutus-metal-adjusted.component';

const routes: Routes = [
    { path: '', component: MiscPlutusMetalAdjustedComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MiscPlutusMetalAdjustedRoutingModule { }