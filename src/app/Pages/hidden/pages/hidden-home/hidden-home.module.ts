import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiddenHomeComponent } from './home/hidden-home.component';
import { HiddenHomeRoutingModule } from './hidden-home-routing.module';
import { HiddenSharedModule } from '../../side-navigation/hidden-shared.module';

@NgModule({
    declarations: [HiddenHomeComponent],
    imports: [CommonModule, HiddenHomeRoutingModule, HiddenSharedModule],
    exports: [HiddenHomeComponent]
})
export class HiddenHomeModule { }
