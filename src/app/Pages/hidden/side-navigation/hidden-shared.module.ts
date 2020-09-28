import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HiddenSideNavigationComponent } from "./side-navigation/hidden-side-navigation.component";
import { SharedModule } from "../../../Shared/shared.module";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [HiddenSideNavigationComponent],
    exports: [HiddenSideNavigationComponent, SharedModule]
})
export class HiddenSharedModule { }