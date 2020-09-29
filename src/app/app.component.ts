import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators'; 

//declare gives Angular app access to ga function
declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  url: string;
  lastInputs: string[] = [];
  konamiCode: string[] = [
    "ArrowUp", 
    "ArrowUp", 
    "ArrowDown", 
    "ArrowDown", 
    "ArrowLeft", 
    "ArrowRight", 
    "ArrowLeft", 
    "ArrowRight", 
    "b", 
    "a"
  ];

  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        gtag('config', 'UA-174027920-1', {'page_path': event.urlAfterRedirects});
      }
    })
    
    // redirects if sessionstorage contains a redirect entry, this is done to give support to github.io
    if (sessionStorage.getItem("redirect")) {
      router.navigateByUrl(sessionStorage.getItem("redirect"));
    }
  }
  
  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((e: NavigationEnd) => this.url = e.urlAfterRedirects)
    ).subscribe();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    // prevents a helddown key from being counted more than once
    if (event.repeat) { return }
    if (event.key == "Unidentified") { return }

    this.lastInputs.push(event.key);
    
    // limit the length of the last inputs to become larger than the number of inputs it is compared against
    if(this.lastInputs.length > this.konamiCode.length) {
      this.lastInputs.shift();
    }

    // compares the last inputs to the code, if they match you are redirected to the hidden page
    if(this.lastInputs.join() == this.konamiCode.join()) {
      this.router.navigateByUrl("/hidden");
    }
  }
}