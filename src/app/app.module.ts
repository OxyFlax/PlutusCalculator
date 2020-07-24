import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClickOutsideDirective } from './Directives/click-outside.directive';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MaplestoryHomeComponent } from './Pages/Games/Maplestory/Pages/maplestory-home/maplestory-home.component';
import { MaplestorySideNavigationComponent } from './Pages/Games/Maplestory/side-navigation/maplestoryside-navigation.component';
import { ArkHomeComponent } from './Pages/Games/Ark/Pages/ark-home/ark-home.component';
import { OverwatchHomeComponent } from './Pages/Games/Overwatch/Pages/overwatch-home/overwatch-home.component';
import { ArkSideNavigationComponent } from './Pages/Games/Ark/side-navigation/ark-side-navigation.component';
import { OverwatchSideNavigationComponent } from './Pages/Games/Overwatch/side-navigation/overwatch-side-navigation.component';
import { HomeComponent } from './Pages/home/home.component';
import { AboutComponent } from './Pages/about/about.component';
import { MaplestoryArcaneSymbolsComponent } from './Pages/Games/Maplestory/Pages/maplestory-arcane-symbols/maplestory-arcane-symbols.component';
import { NotFoundComponent } from './Pages/not-found/not-found.component';
import { MaplestoryAfkExperienceEventComponent } from './Pages/Games/Maplestory/Pages/maplestory-afk-experience-event/maplestory-afk-experience-event.component';
import { MaplestoryDailiesComponent } from './Pages/Games/Maplestory/Pages/maplestory-dailies/maplestory-dailies.component';
import { MaplestoryWeekliesComponent } from './Pages/Games/Maplestory/Pages/maplestory-weeklies/maplestory-weeklies.component';
import { MaplestoryClassPickerComponent } from './Pages/Games/Maplestory/Pages/maplestory-class-picker/maplestory-class-picker.component';
import { ArkTamingCalculatorComponent } from './Pages/Games/Ark/Pages/ark-taming-calculator/ark-taming-calculator.component';
import { OverwatchRandomHeroSelectorComponent } from './Pages/Games/Overwatch/Pages/overwatch-random-hero-selector/overwatch-random-hero-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ClickOutsideDirective,
    MaplestoryHomeComponent,
    MaplestorySideNavigationComponent,
    ArkHomeComponent,
    ArkSideNavigationComponent,
    OverwatchHomeComponent,
    OverwatchSideNavigationComponent,
    HomeComponent,
    AboutComponent,
    MaplestoryArcaneSymbolsComponent,
    NotFoundComponent,
    MaplestoryAfkExperienceEventComponent,
    MaplestoryDailiesComponent,
    MaplestoryWeekliesComponent,
    MaplestoryClassPickerComponent,
    ArkTamingCalculatorComponent,
    OverwatchRandomHeroSelectorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
