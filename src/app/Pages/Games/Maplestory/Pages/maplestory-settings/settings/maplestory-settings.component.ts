import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { settings } from 'cluster';
import { Settings } from '../../../Models/settings';

@Component({
  selector: 'app-maplestory-settings',
  templateUrl: './maplestory-settings.component.html',
  styleUrls: ['./maplestory-settings.component.css']
})
export class MaplestorySettingsComponent implements OnInit {
  //file: any;
  // settingsToExport: string[] = ['dailiesData', 'weekliesData', 'arcaneSymbolSaveData', 'flameData', 'weaponFlameData'];
  settingsData: Settings = {
    dailiesData: "",
    weekliesData: "",
    arcaneSymbolSaveData: "",
    flameData: "",
    weaponFlameData: ""
  }

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
    if(localStorage.getItem("dailiesData")){
      this.settingsData.dailiesData = localStorage.getItem("dailiesData")
    }

    if(localStorage.getItem("weekliesData")){
      this.settingsData.weekliesData = localStorage.getItem("weekliesData")
    }

    if(localStorage.getItem("arcaneSymbolSaveData")){
      this.settingsData.arcaneSymbolSaveData = localStorage.getItem("arcaneSymbolSaveData")
    }

    if(localStorage.getItem("flameData")){
      this.settingsData.flameData = localStorage.getItem("flameData")
    }

    if(localStorage.getItem("weaponFlameData")){
      this.settingsData.weaponFlameData = localStorage.getItem("weaponFlameData")
    }

    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(JSON.stringify(this.settingsData)));
    a.setAttribute('download', "MapleTrackerSettings.json");
    a.click()
    this.clearSettingsData();
  }


  importSettings(e) {
    var file: any = e.target.files[0];
    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      try {
        this.settingsData = JSON.parse(fileReader.result.toString());

        if (this.settingsData.dailiesData) {
          localStorage.setItem("dailiesData", this.settingsData.dailiesData)
        }

        if (this.settingsData.weekliesData) {
          localStorage.setItem("weekliesData", this.settingsData.weekliesData)
        }

        if (this.settingsData.arcaneSymbolSaveData) {
          localStorage.setItem("arcaneSymbolSaveData", this.settingsData.arcaneSymbolSaveData)
        }

        if (this.settingsData.flameData) {
          localStorage.setItem("flameData", this.settingsData.flameData)
        }

        if (this.settingsData.weaponFlameData) {
          localStorage.setItem("weaponFlameData", this.settingsData.weaponFlameData)
        }

        alert("The settings have been successfully imported.");
      } catch (e) {
        alert("Something went wrong when importing the settings, make sure you are selecting the correct file.");
      }
    }

    fileReader.readAsText(file);
    this.clearSettingsData();
  }

  resetData(name: string) {
    if (localStorage.getItem(name)) {
      localStorage.removeItem(name);
    }
  }

  clearSettingsData() {
    this.settingsData = {
      dailiesData: "",
      weekliesData: "",
      arcaneSymbolSaveData: "",
      flameData: "",
      weaponFlameData: ""
    }
  }
}
