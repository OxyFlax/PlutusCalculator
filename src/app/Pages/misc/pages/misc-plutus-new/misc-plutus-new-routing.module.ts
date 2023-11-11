import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiscPlutusNewComponent } from './plutus-new/misc-plutus-new.component';

const routes: Routes = [
    { path: '', component: MiscPlutusNewComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MiscPlutusNewRoutingModule { }