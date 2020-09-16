import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'search-select',
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.css']
})
export class SearchSelectComponent implements OnInit {
  @Input() data: [];
  @Input() defaultIndex: number;
  @Input() inputTitle: string = "";
  @Output() result = new EventEmitter<any>();
  mappedData: Data[];

  showList: boolean = false;
  selectedItem: string = "";
  filter: string = "";

  ngOnInit() {
    this.mappedData = this.data;
    this.returnItem(this.data[this.defaultIndex])
  }

  show() {
    this.showList = true;
    if(this.filter == this.selectedItem) {
      this.filter = "";
    }
  }

  hide() {
    this.showList = false;
    if(this.filter != this.selectedItem) {
      this.filter = this.selectedItem;
    }
  }

  returnItem(item: any) {
    this.filter = item.name;
    this.selectedItem = item.name;
    this.emitResult(item);
  }

  findMatch() {
    var results: Data[] = [];
    this.mappedData.forEach(item => {
      if (item.name.toLowerCase().includes(this.filter.toLowerCase())) {
        results.push(item);
      }
    });

    if(results.length >= 1) {
      this.showList = false;
      this.filter = results[0].name;
      this.selectedItem = results[0].name;
      this.emitResult(results[0]);
    } else {
      this.hide();
    }
  }

  emitResult(item: any){
    this.result.emit(item);
  }
}

class Data {
  name: string;
}
