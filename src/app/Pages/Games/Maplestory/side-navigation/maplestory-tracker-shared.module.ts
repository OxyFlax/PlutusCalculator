import { NgModule } from "@angular/core";
import { TaskComponent } from "../Components/task/task.component";
import { UrsusTaskComponent } from "../Components/task/custom-tasks/ursus-task/ursus-task.component";
import { TaskGroupComponent } from "../Components/task-group/task-group.component";
import { TaskAdderComponent } from "../Components/task-adder/task-adder.component";
import { TopbarDefaultComponent } from "../Components/task-topbar-default/task-topbar-default.component";
import { TopbarEditmodeComponent } from "../Components/task-topbar-editmode/task-topbar-editmode.component";
import { CharacterNavigationBarComponent } from "../Components/task-character-navigation-bar/task-character-navigation-bar.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../../Shared/shared.module";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [TaskComponent, UrsusTaskComponent, TaskGroupComponent, TaskAdderComponent, TopbarDefaultComponent, TopbarEditmodeComponent, CharacterNavigationBarComponent],
    exports: [TaskComponent, UrsusTaskComponent, TaskGroupComponent, TaskAdderComponent, TopbarDefaultComponent, TopbarEditmodeComponent, CharacterNavigationBarComponent]
})
export class MaplestoryTrackerSharedModule { }