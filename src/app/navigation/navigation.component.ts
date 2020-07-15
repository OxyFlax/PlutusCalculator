import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  showGamesDropDown: boolean = false;
  showSettingsDropDown: boolean = false;
  darkMode: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  toggleTheme(){
    alert("Not yet implemented");
    console.log("yes");
  }

  showDropDown(event, type) {
    if (type == "games"){
      if(!this.showGamesDropDown){
        this.showGamesDropDown = true;
        this.showSettingsDropDown = false;
        event.stopPropagation();
      }
    }

    if (type == "settings"){
      if(!this.showSettingsDropDown){
        this.showSettingsDropDown = true;
        this.showGamesDropDown = false;
        event.stopPropagation();
      }
    }
  }

  hideDropDown(type) {
    if (type == "games"){
      this.showGamesDropDown = false;
    }

    if (type == "settings"){
      this.showSettingsDropDown = false;
    }
  }


}
