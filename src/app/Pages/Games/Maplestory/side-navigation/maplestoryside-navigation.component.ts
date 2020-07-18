import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maplestory-side-navigation',
  templateUrl: './maplestory-side-navigation.component.html',
  styleUrls: ['./maplestory-side-navigation.component.css']
})
export class MaplestorySideNavigationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

}
