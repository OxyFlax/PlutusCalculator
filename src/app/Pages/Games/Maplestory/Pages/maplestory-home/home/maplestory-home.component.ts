import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-maplestory-home',
  templateUrl: './maplestory-home.component.html',
  styleUrls: ['./maplestory-home.component.css']
})
export class MaplestoryHomeComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Maplestory Home | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "The home page for the various Maplestory calculators and trackers on here."});
    if(!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }
  }

}
