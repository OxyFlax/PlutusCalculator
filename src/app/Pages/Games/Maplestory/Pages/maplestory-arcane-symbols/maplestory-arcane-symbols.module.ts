import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryArcaneSymbolsComponent } from './arcane-symbols/maplestory-arcane-symbols.component';
import { MaplestoryArcaneSymbolsRoutingModule } from './maplestory-arcane-symbols-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';
import { VanishingJourneyComponent } from './arcane-symbols/Areas/vanishing-journey/vanishing-journey.component';
import { ChuChuComponent } from './arcane-symbols/Areas/chu-chu/chu-chu.component';
import { LacheleinComponent } from './arcane-symbols/Areas/lachelein/lachelein.component';
import { ArcanaComponent } from './arcane-symbols/Areas/arcana/arcana.component';
import { MorassComponent } from './arcane-symbols/Areas/morass/morass.component';
import { EsferaComponent } from './arcane-symbols/Areas/esfera/esfera.component';

@NgModule({
    declarations: [
        MaplestoryArcaneSymbolsComponent,
        VanishingJourneyComponent,
        ChuChuComponent,
        LacheleinComponent,
        ArcanaComponent,
        MorassComponent,
        EsferaComponent
    ],
    imports: [
        CommonModule, 
        MaplestoryArcaneSymbolsRoutingModule, 
        MaplestorySharedModule
    ],
    exports: [MaplestoryArcaneSymbolsComponent]
})
export class MaplestoryArcaneSymbolsModule { }
