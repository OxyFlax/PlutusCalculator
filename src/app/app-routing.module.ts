import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { AboutComponent } from './Pages/about/about.component';
import { NotFoundComponent } from './Pages/not-found/not-found.component';

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
        path: 'games/maplestory/dailies1', 
        loadChildren: () => import('./Pages/Games/Maplestory/Pages/maplestory-dailies-v1/maplestory-dailies-v1.module').then(m => m.MaplestoryDailiesV1Module)
    },
    {
        path: 'games/maplestory/weeklies1', 
        loadChildren: () => import('./Pages/Games/Maplestory/Pages/maplestory-weeklies-v1/maplestory-weeklies-v1.module').then(m => m.MaplestoryWeekliesV1Module)
    },
    {
        path: 'games/maplestory/home', 
        loadChildren: () => import('./Pages/Games/Maplestory/Pages/maplestory-home/maplestory-home.module').then(m => m.MaplestoryHomeModule)
    },
    {
        path: 'games/maplestory/arcane-symbols', 
        loadChildren: () => import('./Pages/Games/Maplestory/Pages/maplestory-arcane-symbols/maplestory-arcane-symbols.module').then(m => m.MaplestoryArcaneSymbolsModule)
    },
    {
        path: 'games/maplestory/item-flames', 
        loadChildren: () => import('./Pages/Games/Maplestory/Pages/maplestory-item-flame-calculator/maplestory-item-flame-calculator.module').then(m => m.MaplestoryItemFlameCalculatorModule)
    },
    {
        path: 'games/maplestory/weapon-flame', 
        loadChildren: () => import('./Pages/Games/Maplestory/Pages/maplestory-weapon-flame-calculator/maplestory-weapon-flame-calculator.module').then(m => m.MaplestoryWeaponFlameCalculatorModule)
    },
    {
        path: 'games/maplestory/settings', 
        loadChildren: () => import('./Pages/Games/Maplestory/Pages/maplestory-settings/maplestory-settings.module').then(m => m.MaplestorySettingsModule)
    },
    {
        path: 'games/maplestory/dailies', 
        loadChildren: () => import('./Pages/Games/Maplestory/Pages/maplestory-dailies-v2/maplestory-dailies-v2.module').then(m => m.MaplestoryDailiesV2Module)
    },
    {
        path: 'games/maplestory/weeklies', 
        loadChildren: () => import('./Pages/Games/Maplestory/Pages/maplestory-weeklies-v2/maplestory-weeklies-v2.module').then(m => m.MaplestoryWeekliesV2Module)
    },



    {
        path: 'games/overwatch/home', 
        loadChildren: () => import('./Pages/Games/Overwatch/Pages/overwatch-home/overwatch-home.module').then(m => m.OverwatchHomeModule)
    },
    {
        path: 'games/overwatch/random-hero-selector', 
        loadChildren: () => import('./Pages/Games/Overwatch/Pages/overwatch-random-hero-selector/overwatch-random-hero-selector.module').then(m => m.OverwatchRandomHeroSelectorModule)
    },



    {
        path: 'games/genshin/home', 
        loadChildren: () => import('./Pages/Games/GenshinImpact/Pages/genshin-home/genshin-home.module').then(m => m.GenshinHomeModule)
    },
    {
        path: 'games/genshin/dailies', 
        loadChildren: () => import('./Pages/Games/GenshinImpact/Pages/genshin-dailies/genshin-dailies.module').then(m => m.GenshinDailiesModule)
    },
    {
        path: 'games/genshin/weeklies', 
        loadChildren: () => import('./Pages/Games/GenshinImpact/Pages/genshin-weeklies/genshin-weeklies.module').then(m => m.GenshinWeekliesModule)
    },



    {
        path: 'hidden', 
        loadChildren: () => import('./Pages/Hidden/Pages/hidden-home/hidden-home.module').then(m => m.HiddenHomeModule)
    },
    {
        path: 'hidden/timer', 
        loadChildren: () => import('./Pages/Hidden/Pages/hidden-timer/hidden-timer.module').then(m => m.HiddenTimerModule)
    },
    {
        path: 'hidden/stopwatch', 
        loadChildren: () => import('./Pages/Hidden/Pages/hidden-stopwatch/hidden-stopwatch.module').then(m => m.HiddenStopwatchModule)
    },
    {
        path: 'hidden/binary-translator', 
        loadChildren: () => import('./Pages/Hidden/Pages/hidden-binary-translator/hidden-binary-translator.module').then(m => m.HiddenBinaryTranslatorModule)
    },
    {
        path: 'hidden/hexrgb-converter', 
        loadChildren: () => import('./Pages/Hidden/Pages/hidden-hexrgb-converter/hidden-hexrgb-converter.module').then(m => m.HiddenHexRGBConverterModule)
    },
    {
        path: 'hidden/palette-generator', 
        loadChildren: () => import('./Pages/Hidden/Pages/hidden-palette-generator/hidden-palette-generator.module').then(m => m.HiddenPaletteGeneratorModule)
    },



    {
        path: 'misc/skribbl', 
        loadChildren: () => import('./Pages/Misc/Pages/misc-skribbl/misc-skribbl.module').then(m => m.MiscSkribblModule)
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
