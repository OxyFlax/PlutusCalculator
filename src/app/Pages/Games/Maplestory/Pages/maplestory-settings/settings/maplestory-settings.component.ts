import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-maplestory-settings',
  templateUrl: './maplestory-settings.component.html',
  styleUrls: ['./maplestory-settings.component.css']
})
export class MaplestorySettingsComponent implements OnInit {
  settingsToExport: string[] = ['dailiesVersion', 'dailies', 'lastMapleDailyTrackerVisit', 'weekliesVersion', 'weeklies', 'lastMapleWeeklyTrackerVisit', 'arcaneSymbolSaveData', 'flameData', 'weaponFlameData', 'mapleRegion'];
  data: any = "PLS WORK THANKYOU"

  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Maplestory Settings Export | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "The page for exporting your saved settings for the various Maplestory calculators and trackers."});
    if(!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }
  }

  exportSettings() {
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(this.data));
    a.setAttribute('download', "MapleStorySettings.RS");
    a.click()

    this.settingsToExport.forEach(obj => {
      if (localStorage.getItem(obj)) {
        console.log(obj + "exist");
      } else {
        console.log("dailies not");
      }
    });
  }

}
