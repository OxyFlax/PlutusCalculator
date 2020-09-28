import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryHomeComponent } from './home/maplestory-home.component';
import { MaplestoryHomeRoutingModule } from './maplestory-home-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';

@NgModule({
    declarations: [MaplestoryHomeComponent],
    imports: [
        CommonModule,
        MaplestoryHomeRoutingModule,
        MaplestorySharedModule
    ],
    exports: [
        MaplestoryHomeComponent,
    ]
})
export class MaplestoryHomeModule { }
