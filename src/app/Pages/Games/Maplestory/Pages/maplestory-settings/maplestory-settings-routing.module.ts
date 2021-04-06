import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestorySettingsComponent } from './settings/maplestory-settings.component';

const routes: Routes = [
    { path: '', component: MaplestorySettingsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestorySettingsRoutingModule { }