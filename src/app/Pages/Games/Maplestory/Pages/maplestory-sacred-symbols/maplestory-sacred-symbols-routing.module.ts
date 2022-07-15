import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestorySacredSymbolsComponent } from './sacred-symbols/maplestory-sacred-symbols.component';

const routes: Routes = [
    { path: '', component: MaplestorySacredSymbolsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestorySacredSymbolsRoutingModule { }