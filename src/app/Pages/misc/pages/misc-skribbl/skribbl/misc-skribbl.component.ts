import { Component, OnInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-misc-skribbl',
  templateUrl: './misc-skribbl.component.html',
  styleUrls: ['./misc-skribbl.component.css']
})
export class MiscSkribblComponent implements OnInit, OnDestroy {
  input: string = "";
  output: string = "";
  wordCount: number = 0;

  constructor(private titleService: Title, private metaService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("Misc Skribbl | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "Custom skribble.io words duplicate filter"});
    if(!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "noindex, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "noindex, follow" });
    }
  }

  ngOnDestroy() {
    this.titleService.setTitle("Random Stuff");
  }

  removeDuplicates() {
    var res = this.input.split(",");

    res = res.map(function (item) {
      return item.trim();
    });

    // remove duplicates
    var uniqueArray = res.reduce(function(a,b){
      if (a.indexOf(b) < 0 ) a.push(b);
      return a;
    },[]);

    this.wordCount = uniqueArray.length;
    this.output = uniqueArray.join(", ");
  }
}

