import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SearchSelectComponent } from "./search-select/search-select.component";
import { SharedModule } from "../../Shared/shared.module";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [SearchSelectComponent],
    exports: [SearchSelectComponent]
})
export class SearchSelectModule { }