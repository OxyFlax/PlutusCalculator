import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

//declare gives Angular app access to ga function
declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public router: Router) {
    // this.router.events.subscribe(event => {
    //   if(event instanceof NavigationEnd){
    //     gtag('config', 'UA-174027920-1', {'page_path': event.urlAfterRedirects});
    //   }
    // })

    
    // redirects if sessionstorage contains a redirect entry, this is done to give support to github.io
    if (sessionStorage.getItem("redirect")) {
      router.navigateByUrl(sessionStorage.getItem("redirect"));
    }
  }
}