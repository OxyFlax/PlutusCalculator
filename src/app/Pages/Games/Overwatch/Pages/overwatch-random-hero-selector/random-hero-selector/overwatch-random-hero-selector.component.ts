import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import HeroesJson from '../../../../../../../assets/Games/Overwatch/Heroes.json';
import { Hero } from '../../../Models/hero';

@Component({
  selector: 'app-overwatch-random-hero-selector',
  templateUrl: './overwatch-random-hero-selector.component.html',
  styleUrls: ['./overwatch-random-hero-selector.component.css']
})
export class OverwatchRandomHeroSelectorComponent implements OnInit {
  heroesList: Hero[] = HeroesJson.heroes;
  selectedHero: Hero = { name: "Unknown", image: "" }

  constructor(private titleService: Title, private metaService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("Overwatch Random Hero Selector | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "A randomized Overwatch hero picker, get assigned a random hero to play."});
    if(!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }
  }

  selectRandomHero() {
    var newHero: Hero = this.heroesList[this.getRandomArrayIndex(this.heroesList.length)];
    while (this.selectedHero.name === newHero.name) {
      newHero = this.heroesList[this.getRandomArrayIndex(this.heroesList.length)];
    }
    this.selectedHero = newHero;
  }

  getRandomArrayIndex(arrayLength) {
    return Math.floor(Math.random() * (arrayLength));
  }

}
