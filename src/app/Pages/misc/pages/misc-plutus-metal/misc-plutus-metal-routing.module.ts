import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiscPlutusMetalComponent } from './plutus-metal/misc-plutus-metal.component';

const routes: Routes = [
    { path: '', component: MiscPlutusMetalComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MiscPlutusMetalRoutingModule { }