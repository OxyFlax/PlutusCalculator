import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OverwatchSideNavigationComponent } from "./side-navigation/overwatch-side-navigation.component";
import { SharedModule } from "../../../../Shared/shared.module";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [OverwatchSideNavigationComponent],
    exports: [OverwatchSideNavigationComponent, SharedModule]
})
export class OverwatchSharedModule { }