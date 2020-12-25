import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiddenHexRGBConverterComponent } from './hexrgb-converter/hidden-hexrgb-converter.component';
import { HiddenHexRGBConverterRoutingModule } from './hidden-hexrgb-converter-routing.module';
import { HiddenSharedModule } from '../../side-navigation/hidden-shared.module';

@NgModule({
    declarations: [HiddenHexRGBConverterComponent],
    imports: [CommonModule, HiddenHexRGBConverterRoutingModule, HiddenSharedModule],
    exports: [HiddenHexRGBConverterComponent]
})
export class HiddenHexRGBConverterModule { }
