import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryWeaponFlameCalculatorComponent } from './weapon-flame-calculator/maplestory-weapon-flame-calculator.component';
import { MaplestoryWeaponFlameCalculatorRoutingModule } from './maplestory-weapon-flame-calculator-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';

@NgModule({
    declarations: [MaplestoryWeaponFlameCalculatorComponent],
    imports: [CommonModule, MaplestoryWeaponFlameCalculatorRoutingModule, MaplestorySharedModule],
    exports: [MaplestoryWeaponFlameCalculatorComponent]
})
export class MaplestoryWeaponFlameCalculatorModule { }
