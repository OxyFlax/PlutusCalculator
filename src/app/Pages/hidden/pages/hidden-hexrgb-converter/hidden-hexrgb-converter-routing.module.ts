import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HiddenHexRGBConverterComponent } from './hexrgb-converter/hidden-hexrgb-converter.component';

const routes: Routes = [
    { path: '', component: HiddenHexRGBConverterComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HiddenHexRGBConverterRoutingModule { }