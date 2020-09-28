import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ClickOutsideDirective } from "../Directives/click-outside.directive";
import { MiddleclickDirective } from "../Directives/middle-click.directive";
import { LongPressDirective } from "../Directives/long-press.directive";
import { ScrollToDirective } from "../Directives/scroll-to.directive";

@NgModule({
    imports: [CommonModule, RouterModule, FormsModule],
    declarations: [
        ClickOutsideDirective,
        MiddleclickDirective,
        LongPressDirective,
        ScrollToDirective
    ],
    exports: [
        ClickOutsideDirective,
        MiddleclickDirective,
        LongPressDirective,
        ScrollToDirective,
        RouterModule,
        FormsModule
    ]
})
export class SharedModule { }