import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscPlutusCalculatorComponent } from './plutus-calculator/misc-plutus-calculator.component';
import { MiscPlutusCalculatorRoutingModule } from './misc-plutus-calculator-routing.module';
import { SharedModule } from '../../../../Shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [MiscPlutusCalculatorComponent],
    imports: [CommonModule, SharedModule, MiscPlutusCalculatorRoutingModule, NgSelectModule, FormsModule],
    exports: [MiscPlutusCalculatorComponent]
})
export class MiscPlutusCalculatorModule { }
