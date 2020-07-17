import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';

import { ClickOutsideDirective } from './Directives/click-outside.directive';
import { MaplestoryHomeComponent } from './Games/Maplestory/Pages/maplestory-home/maplestory-home.component';
import { MaplestorySideNavigationComponent } from './Games/Maplestory/side-navigation/maplestoryside-navigation.component';
import { ArkHomeComponent } from './Games/Ark/Pages/ark-home/ark-home.component';
import { OverwatchHomeComponent } from './Games/Overwatch/Pages/overwatch-home/overwatch-home.component';
import { ArkSideNavigationComponent } from './Games/Ark/side-navigation/ark-side-navigation.component';
import { OverwatchSideNavigationComponent } from './Games/Overwatch/side-navigation/overwatch-side-navigation.component';

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
    OverwatchSideNavigationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
