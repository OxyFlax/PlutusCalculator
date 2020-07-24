import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ark-side-navigation',
  templateUrl: './ark-side-navigation.component.html',
  styleUrls: ['./ark-side-navigation.component.css']
})
export class ArkSideNavigationComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

}
