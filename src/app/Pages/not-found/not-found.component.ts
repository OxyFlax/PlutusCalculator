import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  darkMode: boolean = true;

  constructor(public router: Router, private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle('404 | Random Stuff');
    this.metaService.updateTag({ name: 'description', content: 'Random Stuff 404 page.' });
    if(!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "noindex, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "noindex, follow" });
    }
  }
}
