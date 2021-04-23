import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GenshinSideNavigationComponent } from "./side-navigation/genshin-side-navigation.component";
import { SharedModule } from "../../../../Shared/shared.module";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [GenshinSideNavigationComponent],
    exports: [GenshinSideNavigationComponent, SharedModule]
})
export class GenshinSharedModule { }