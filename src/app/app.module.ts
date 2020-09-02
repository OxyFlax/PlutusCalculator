import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ClickOutsideDirective } from './Directives/click-outside.directive';
import { MiddleclickDirective } from './Directives/middle-click.directive';

import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';

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
import { VanishingJourneyComponent } from './Pages/Games/Maplestory/Pages/maplestory-arcane-symbols/Areas/vanishing-journey/vanishing-journey.component';
import { ChuChuComponent } from './Pages/Games/Maplestory/Pages/maplestory-arcane-symbols/Areas/chu-chu/chu-chu.component';
import { LacheleinComponent } from './Pages/Games/Maplestory/Pages/maplestory-arcane-symbols/Areas/lachelein/lachelein.component';
import { ArcanaComponent } from './Pages/Games/Maplestory/Pages/maplestory-arcane-symbols/Areas/arcana/arcana.component';
import { MorassComponent } from './Pages/Games/Maplestory/Pages/maplestory-arcane-symbols/Areas/morass/morass.component';
import { EsferaComponent } from './Pages/Games/Maplestory/Pages/maplestory-arcane-symbols/Areas/esfera/esfera.component';
import { HiddenSideNavigationComponent } from './Pages/hidden/side-navigation/hidden-side-navigation.component';
import { HiddenHomeComponent } from './Pages/hidden/pages/hidden-home/hidden-home.component';
import { HiddenTimerComponent } from './Pages/hidden/pages/hidden-timer/hidden-timer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ClickOutsideDirective,
    MiddleclickDirective,
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
    OverwatchRandomHeroSelectorComponent,
    VanishingJourneyComponent,
    ChuChuComponent,
    LacheleinComponent,
    ArcanaComponent,
    MorassComponent,
    EsferaComponent,
    HiddenSideNavigationComponent,
    HiddenHomeComponent,
    HiddenTimerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
