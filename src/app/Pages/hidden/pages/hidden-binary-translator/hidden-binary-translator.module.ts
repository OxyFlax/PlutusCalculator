import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiddenBinaryTranslatorComponent } from './binary-translator/hidden-binary-translator.component';
import { HiddenBinaryTranslatorRoutingModule } from './hidden-binary-translator-routing.module';
import { HiddenSharedModule } from '../../side-navigation/hidden-shared.module';

@NgModule({
    declarations: [HiddenBinaryTranslatorComponent],
    imports: [CommonModule, HiddenBinaryTranslatorRoutingModule, HiddenSharedModule],
    exports: [HiddenBinaryTranslatorComponent]
})
export class HiddenBinaryTranslatorModule { }
