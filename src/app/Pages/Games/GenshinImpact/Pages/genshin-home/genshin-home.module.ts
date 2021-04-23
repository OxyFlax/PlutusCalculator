import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenshinHomeComponent } from './home/genshin-home.component';
import { GenshinHomeRoutingModule } from './genshin-home-routing.module';
import { GenshinSharedModule } from '../../side-navigation/genshin-shared.module';

@NgModule({
    declarations: [GenshinHomeComponent],
    imports: [
        CommonModule,
        GenshinHomeRoutingModule,
        GenshinSharedModule
    ],
    exports: [
        GenshinHomeComponent,
    ]
})
export class GenshinHomeModule { }
