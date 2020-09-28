import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaplestorySideNavigationComponent } from "./side-navigation/maplestory-side-navigation.component";
import { SharedModule } from "../../../../Shared/shared.module";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [MaplestorySideNavigationComponent],
    exports: [MaplestorySideNavigationComponent, SharedModule]
})
export class MaplestorySharedModule { }