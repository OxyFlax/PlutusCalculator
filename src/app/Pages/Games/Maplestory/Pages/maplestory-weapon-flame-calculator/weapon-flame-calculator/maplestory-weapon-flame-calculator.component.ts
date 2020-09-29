import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-maplestory-weapon-flame-calculator',
  templateUrl: './maplestory-weapon-flame-calculator.component.html',
  styleUrls: ['./maplestory-weapon-flame-calculator.component.css']
})
export class MaplestoryWeaponFlameCalculatorComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("Maplestory Weapon Flame Calculator | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "Maplestory weapon flame calculator to determine the tier of an attack flame on a weapon."});
    if(!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }
  }
}
