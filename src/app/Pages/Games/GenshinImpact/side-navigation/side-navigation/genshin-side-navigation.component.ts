import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-genshin-side-navigation',
  templateUrl: './genshin-side-navigation.component.html',
  styleUrls: ['./genshin-side-navigation.component.css']
})
export class GenshinSideNavigationComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

}
