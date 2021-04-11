import { Component, Input } from '@angular/core';
import { DailiesData } from '../../../../Models/dailies';

@Component({
  selector: 'app-character-navigation-bar',
  templateUrl: './character-navigation-bar.component.html',
  styleUrls: ['./character-navigation-bar.component.css']
})
export class CharacterNavigationBarComponent {
  @Input() dailiesData: DailiesData;


  changeCharacter(index: number) {
    this.dailiesData.selecterCharacterIndex = index;
  }
}
