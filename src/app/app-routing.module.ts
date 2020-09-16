import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArkHomeComponent } from './Pages/Games/Ark/Pages/ark-home/ark-home.component';
import { MaplestoryHomeComponent } from './Pages/Games/Maplestory/Pages/maplestory-home/maplestory-home.component';
import { OverwatchHomeComponent } from './Pages/Games/Overwatch/Pages/overwatch-home/overwatch-home.component';
import { HomeComponent } from './Pages/home/home.component';
import { AboutComponent } from './Pages/about/about.component';
import { MaplestoryArcaneSymbolsComponent } from './Pages/Games/Maplestory/Pages/maplestory-arcane-symbols/maplestory-arcane-symbols.component';
import { NotFoundComponent } from './Pages/not-found/not-found.component';
import { MaplestoryDailiesComponent } from './Pages/Games/Maplestory/Pages/maplestory-dailies/maplestory-dailies.component';
import { MaplestoryWeekliesComponent } from './Pages/Games/Maplestory/Pages/maplestory-weeklies/maplestory-weeklies.component';
import { MaplestoryClassPickerComponent } from './Pages/Games/Maplestory/Pages/maplestory-class-picker/maplestory-class-picker.component';
import { ArkTamingCalculatorComponent } from './Pages/Games/Ark/Pages/ark-taming-calculator/ark-taming-calculator.component';
import { OverwatchRandomHeroSelectorComponent } from './Pages/Games/Overwatch/Pages/overwatch-random-hero-selector/overwatch-random-hero-selector.component';
import { HiddenHomeComponent } from './Pages/hidden/pages/hidden-home/hidden-home.component';
import { HiddenTimerComponent } from './Pages/hidden/pages/hidden-timer/hidden-timer.component';
import { HiddenStopwatchComponent } from './Pages/hidden/pages/hidden-stopwatch/hidden-stopwatch.component';
import { MaplestoryItemFlameCalculatorComponent } from './Pages/Games/Maplestory/Pages/maplestory-item-flame-calculator/maplestory-item-flame-calculator.component';
import { MaplestoryWeaponFlameCalculatorComponent } from './Pages/Games/Maplestory/Pages/maplestory-weapon-flame-calculator/maplestory-weapon-flame-calculator.component';

const routes: Routes = [
    {
        path: '', 
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'about', 
        component: AboutComponent
    },
    {
        path: 'games/ark/home', 
        component: ArkHomeComponent
    },
    {
        path: 'games/ark/taming-calculator', 
        component: ArkTamingCalculatorComponent
    },
    {
        path: 'games/maplestory/home', 
        component: MaplestoryHomeComponent
    },
    {
        path: 'games/maplestory/arcane-symbols', 
        component: MaplestoryArcaneSymbolsComponent
    },
    {
        path: 'games/maplestory/dailies', 
        component: MaplestoryDailiesComponent
    },
    {
        path: 'games/maplestory/weeklies', 
        component: MaplestoryWeekliesComponent
    },
    {
        path: 'games/maplestory/class-picker', 
        component: MaplestoryClassPickerComponent
    },
    {
        path: 'games/maplestory/item-flames', 
        component: MaplestoryItemFlameCalculatorComponent
    },
    {
        path: 'games/maplestory/weapon-flame', 
        component: MaplestoryWeaponFlameCalculatorComponent
    },
    {
        path: 'games/overwatch/home', 
        component: OverwatchHomeComponent
    },
    {
        path: 'games/overwatch/random-hero-selector', 
        component: OverwatchRandomHeroSelectorComponent
    },
    {
        path: 'hidden', 
        component: HiddenHomeComponent
    },
    {
        path: 'hidden/timer', 
        component: HiddenTimerComponent
    },
    {
        path: 'hidden/stopwatch', 
        component: HiddenStopwatchComponent
    },
    {
        path        : '**',
        redirectTo  : '404',
        pathMatch   : 'full'
    }
    ,
    {
        path        : '404',
        component   : NotFoundComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
