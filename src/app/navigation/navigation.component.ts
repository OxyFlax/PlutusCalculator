import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  showGamesDropDown: boolean = false;
  showSettingsDropDown: boolean = false;
  darkMode: boolean = true;

  constructor(public router: Router) { }

  ngOnInit() {
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

    if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme);

      if (currentTheme === 'light') {
        this.darkMode = false;
      }
    }
  }

  toggleTheme() {
    if (this.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  showDropDown(event, type) {
    if (type == "games") {
      if (!this.showGamesDropDown) {
        this.showGamesDropDown = true;
        this.showSettingsDropDown = false;
        event.stopPropagation();
      }
    }

    if (type == "settings") {
      if (!this.showSettingsDropDown) {
        this.showSettingsDropDown = true;
        this.showGamesDropDown = false;
        event.stopPropagation();
      }
    }
  }

  hideDropDown(type) {
    if (type == "games") {
      this.showGamesDropDown = false;
    }

    if (type == "settings") {
      this.showSettingsDropDown = false;
    }
  }
}
