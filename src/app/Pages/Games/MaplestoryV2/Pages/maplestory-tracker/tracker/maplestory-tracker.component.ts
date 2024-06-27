import { Component, OnInit, OnDestroy } from '@angular/core';
import DailiesJsonV2 from '../../../../../../../assets/Games/Maplestory/DailiesV2.json';
import { Meta, Title } from '@angular/platform-browser';
import { GeneralData } from '../../../Models/generalData';
import { CharacterData } from '../../../Models/characterData';
import { GeneralDataService } from '../../../Services/generalData.service';

// TODO: look into seeing if its possible to also show the info thing when loading the data fails

@Component({
  selector: 'app-maplestory-tracker',
  templateUrl: './maplestory-tracker.component.html',
  styleUrls: ['./maplestory-tracker.component.css']
})
export class MaplestoryTrackerComponent implements OnInit, OnDestroy {
  generalData: GeneralData;
  selectedCharacter: CharacterData;

  editMode: boolean = true;

  

  constructor(private titleService: Title, private metaService: Meta, private generalDataService: GeneralDataService) { }

  ngOnInit() {
    this.titleService.setTitle("Maplestory Dailies Tracker | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "A dailies tracker for Maplestory to keep track of your completed daily tasks. Keep track of your dailies across multiple different characters." });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }

    this.initialise();
  }

  ngOnDestroy() {
  }

  initialise() {
    if (localStorage.getItem("generalData")) {
      this.generalData = JSON.parse(localStorage.getItem("generalData"));

      // with an if so errors can be caught, if it doesn't exist create it for that character and maybe show a pop up?
      if(localStorage.getItem(this.generalData.characters[this.generalData.selectedCharacterIndex].characterStorageReference)) {
        this.selectedCharacter = JSON.parse(localStorage.getItem(this.generalData.characters[this.generalData.selectedCharacterIndex].characterStorageReference));
      } else {
        //TODO: use service to generate data for this character using their already existing storagereference
      }
    } else {
      // generate general data & 4 starting characters (it's save in the creation step)
      this.generalData = this.generalDataService.initiateDataSet();
    }
  }
}