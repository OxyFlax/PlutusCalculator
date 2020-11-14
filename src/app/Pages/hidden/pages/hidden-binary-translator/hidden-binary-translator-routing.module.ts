import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HiddenBinaryTranslatorComponent } from './binary-translator/hidden-binary-translator.component';

const routes: Routes = [
    { path: '', component: HiddenBinaryTranslatorComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HiddenBinaryTranslatorRoutingModule { }