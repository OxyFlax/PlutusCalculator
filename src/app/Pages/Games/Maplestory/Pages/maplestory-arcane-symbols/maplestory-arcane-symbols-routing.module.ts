import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestoryArcaneSymbolsComponent } from './arcane-symbols/maplestory-arcane-symbols.component';

const routes: Routes = [
    { path: '', component: MaplestoryArcaneSymbolsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestoryArcaneSymbolsRoutingModule { }