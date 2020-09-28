import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestoryItemFlameCalculatorComponent } from './item-flame-calculator/maplestory-item-flame-calculator.component';

const routes: Routes = [
    { path: '', component: MaplestoryItemFlameCalculatorComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestoryItemFlameCalculatorRoutingModule { }