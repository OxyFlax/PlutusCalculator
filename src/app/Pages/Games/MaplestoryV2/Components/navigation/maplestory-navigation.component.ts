import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maplestory-navigation',
  templateUrl: './maplestory-navigation.component.html',
  styleUrls: ['./maplestory-navigation.component.css']
})
export class MaplestoryNavigationComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }
}
