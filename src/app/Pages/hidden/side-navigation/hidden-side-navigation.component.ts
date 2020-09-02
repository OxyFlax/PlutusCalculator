import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hidden-side-navigation',
  templateUrl: './hidden-side-navigation.component.html',
  styleUrls: ['./hidden-side-navigation.component.css']
})
export class HiddenSideNavigationComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

}
