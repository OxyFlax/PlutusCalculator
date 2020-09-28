import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryItemFlameCalculatorComponent } from './item-flame-calculator/maplestory-item-flame-calculator.component';
import { MaplestoryItemFlameCalculatorRoutingModule } from './maplestory-item-flame-calculator-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';
import { SearchSelectModule } from '../../../../../../app/Components/search-select/search-select-module';

@NgModule({
    declarations: [MaplestoryItemFlameCalculatorComponent],
    imports: [CommonModule, SearchSelectModule, MaplestoryItemFlameCalculatorRoutingModule, MaplestorySharedModule],
    exports: [MaplestoryItemFlameCalculatorComponent]
})
export class MaplestoryItemFlameCalculatorModule { }
