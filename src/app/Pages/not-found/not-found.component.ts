import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  darkMode: boolean = true;

  constructor(public router: Router) { }

  // ngOnInit() {
  //   const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

  //   if (currentTheme) {
  //     document.documentElement.setAttribute('data-theme', currentTheme);

  //     if (currentTheme === 'light') {
  //       this.darkMode = false;
  //     }
  //   }
  // }

  // toggleTheme() {
  //   if (this.darkMode) {
  //     document.documentElement.setAttribute('data-theme', 'dark');
  //     localStorage.setItem('theme', 'dark');
  //   } else {
  //     document.documentElement.setAttribute('data-theme', 'light');
  //     localStorage.setItem('theme', 'light');
  //   }
  // }

}
