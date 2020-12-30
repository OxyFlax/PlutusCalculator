import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiddenPaletteGeneratorComponent } from './palette-generator/hidden-palette-generator.component';
import { HiddenPaletteGeneratorRoutingModule } from './hidden-palette-generator-routing.module';
import { HiddenSharedModule } from '../../side-navigation/hidden-shared.module';

@NgModule({
    declarations: [HiddenPaletteGeneratorComponent],
    imports: [CommonModule, HiddenPaletteGeneratorRoutingModule, HiddenSharedModule],
    exports: [HiddenPaletteGeneratorComponent]
})
export class HiddenPaletteGeneratorModule { }
