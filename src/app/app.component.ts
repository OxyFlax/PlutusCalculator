import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(router: Router) {
    // redirects if sessionstorage contains a redirect entry, this is done to give support to github.io
    if (sessionStorage.getItem("redirect")) {
      router.navigateByUrl(sessionStorage.getItem("redirect"));
    }
  }
}
