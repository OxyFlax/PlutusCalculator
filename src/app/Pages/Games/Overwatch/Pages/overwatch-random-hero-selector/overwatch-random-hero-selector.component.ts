import { Component, OnInit } from '@angular/core';
import HeroesJson from '../../../../../../assets/Games/Overwatch/Heroes.json';
import { Hero } from '../../Models/hero';

@Component({
  selector: 'app-overwatch-random-hero-selector',
  templateUrl: './overwatch-random-hero-selector.component.html',
  styleUrls: ['./overwatch-random-hero-selector.component.css']
})
export class OverwatchRandomHeroSelectorComponent implements OnInit {
  heroesList: Hero[] = HeroesJson.heroes;
  selectedHero: Hero = { name: "Unknown", image: ""}
  
  constructor() { 
  }

  ngOnInit() {
  }

  selectRandomHero() {
    var newHero: Hero = this.heroesList[this.getRandomArrayIndex(this.heroesList.length)];
    while(this.selectedHero.name === newHero.name) {
      newHero = this.heroesList[this.getRandomArrayIndex(this.heroesList.length)];
    }
    this.selectedHero = newHero;
  }

  getRandomArrayIndex(arrayLength) {
    return Math.floor(Math.random() * (arrayLength));
}

}
