import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaplestoryNavigationComponent } from "./Components/navigation/maplestory-navigation.component";
import { SharedModule } from "../../../Shared/shared.module";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [MaplestoryNavigationComponent],
    exports: [MaplestoryNavigationComponent, SharedModule]
})
export class MaplestorySharedModule { }