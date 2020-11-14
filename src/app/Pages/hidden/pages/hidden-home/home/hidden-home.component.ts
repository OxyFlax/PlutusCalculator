import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-hidden-home',
  templateUrl: './hidden-home.component.html',
  styleUrls: ['./hidden-home.component.css']
})
export class HiddenHomeComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Hidden Home | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "The home page for various hidden projects."});
    if(!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "noindex, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "noindex, follow" });
    }
  }

}
