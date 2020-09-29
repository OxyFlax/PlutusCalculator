import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-overwatch-home',
  templateUrl: './overwatch-home.component.html',
  styleUrls: ['./overwatch-home.component.css']
})
export class OverwatchHomeComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Overwatch Home | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "The home page for the various Overwatch projects on here."});
    if(!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }
  }
}
