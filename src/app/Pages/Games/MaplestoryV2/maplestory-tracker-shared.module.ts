import { NgModule } from "@angular/core";
// import { UrsusTaskComponent } from "../Components/task/custom-tasks/ursus-task/ursus-task.component";
// import { TaskAdderComponent } from "../Components/task-adder/task-adder.component";
// import { TopbarDefaultComponent } from "../Components/task-topbar-default/task-topbar-default.component";
// import { TopbarEditmodeComponent } from "../Components/task-topbar-editmode/task-topbar-editmode.component";
// import { CharacterNavigationBarComponent } from "../Components/task-character-navigation-bar/task-character-navigation-bar.component";
import { CommonModule } from "@angular/common";
// import { YuGardenTaskComponent } from "../Components/task/custom-tasks/yu-garden-task/yu-garden-task.component";
import { SharedModule } from "../../../Shared/shared.module";
import { TaskComponent } from "./Components/tracker/task/task.component";
import { TaskGroupComponent } from "./Components/tracker/task-group/task-group.component";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [TaskComponent, TaskGroupComponent],
    exports: [TaskComponent, TaskGroupComponent]
})
export class MaplestoryTrackerSharedModule { }