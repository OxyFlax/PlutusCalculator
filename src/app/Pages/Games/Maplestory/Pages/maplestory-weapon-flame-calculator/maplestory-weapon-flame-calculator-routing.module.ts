import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestoryWeaponFlameCalculatorComponent } from './weapon-flame-calculator/maplestory-weapon-flame-calculator.component';

const routes: Routes = [
    { path: '', component: MaplestoryWeaponFlameCalculatorComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestoryWeaponFlameCalculatorRoutingModule { }