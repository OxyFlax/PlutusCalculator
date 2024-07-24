import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiscPlutusCalculatorComponent } from './plutus-calculator/misc-plutus-calculator.component';

const routes: Routes = [
    { path: '', component: MiscPlutusCalculatorComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MiscPlutusCalculatorRoutingModule { }