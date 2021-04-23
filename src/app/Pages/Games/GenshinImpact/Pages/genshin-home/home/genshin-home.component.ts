import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-genshin-home',
  templateUrl: './genshin-home.component.html',
  styleUrls: ['./genshin-home.component.css']
})
export class GenshinHomeComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Genshin Impact Home | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "The home page for the various Genshin Impact projects on here."});
    if(!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }
  }
}
