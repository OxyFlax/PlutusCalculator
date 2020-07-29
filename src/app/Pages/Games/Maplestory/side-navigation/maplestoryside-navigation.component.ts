import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maplestory-side-navigation',
  templateUrl: './maplestory-side-navigation.component.html',
  styleUrls: ['./maplestory-side-navigation.component.css']
})
export class MaplestorySideNavigationComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }
}
