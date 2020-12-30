import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HiddenPaletteGeneratorComponent } from './palette-generator/hidden-palette-generator.component';

const routes: Routes = [
    { path: '', component: HiddenPaletteGeneratorComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HiddenPaletteGeneratorRoutingModule { }