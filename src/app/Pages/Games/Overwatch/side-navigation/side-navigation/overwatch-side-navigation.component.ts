import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overwatch-side-navigation',
  templateUrl: './overwatch-side-navigation.component.html',
  styleUrls: ['./overwatch-side-navigation.component.css']
})
export class OverwatchSideNavigationComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

}
