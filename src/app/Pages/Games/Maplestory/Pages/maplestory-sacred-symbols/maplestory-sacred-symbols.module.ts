import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestorySacredSymbolsComponent } from './sacred-symbols/maplestory-sacred-symbols.component';
import { MaplestorySacredSymbolsRoutingModule } from './maplestory-sacred-symbols-routing.module';
import { MaplestorySharedModule } from '../../side-navigation/maplestory-shared.module';
import { CerniumComponent } from './sacred-symbols/Areas/cernium/cernium.component';
import { ArcusComponent } from './sacred-symbols/Areas/arcus/arcus.component';
import { OdiumComponent } from './sacred-symbols/Areas/odium/odium.component';
import { ShangriLaComponent } from './sacred-symbols/Areas/shangri-la/shangri-la.component';
import { ArteriaComponent } from './sacred-symbols/Areas/arteria/arteria.component';
import { CarcionComponent } from './sacred-symbols/Areas/carcion/carcion.component';

@NgModule({
    declarations: [
        MaplestorySacredSymbolsComponent,
        CerniumComponent,
        ArcusComponent,
        OdiumComponent,
        ShangriLaComponent,
        ArteriaComponent,
        CarcionComponent
    ],
    imports: [
        CommonModule, 
        MaplestorySacredSymbolsRoutingModule, 
        MaplestorySharedModule
    ],
    exports: [MaplestorySacredSymbolsComponent]
})
export class MaplestorySacredSymbolsModule { }
