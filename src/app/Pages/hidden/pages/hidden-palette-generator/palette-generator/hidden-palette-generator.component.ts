import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import Vibrant from 'node-vibrant';
import { Palette } from 'node-vibrant/lib/color';

@Component({
  selector: 'app-palette-generator-timer',
  templateUrl: './hidden-palette-generator.component.html',
  styleUrls: ['./hidden-palette-generator.component.css']
})
export class HiddenPaletteGeneratorComponent implements OnInit, OnDestroy {
  colorPalette: string[] = [];
  colorPaletteTextColor: string[] = [];
  image: any = "";

  constructor(private titleService: Title, private metaService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("Palette Generator | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "Personal palette generator." });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "noindex, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "noindex, follow" });
    }
  }

  ngOnDestroy() {
    this.titleService.setTitle("Random Stuff");
  }

  processFile(event: any) { 
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.image = event.target.result;
        this.extractPaletteFromFile(this.image);
      }
    }
  }

  async extractPaletteFromFile(img: any) {
    Vibrant.from(img).getPalette((err, palette) => {
      this.ExtractColorsFromPalette(palette);
    });
  }

  ExtractColorsFromPalette(palette: Palette) {
    this.colorPalette = [];
    this.colorPalette.push(palette.DarkMuted.getHex().toUpperCase());
    this.colorPalette.push(palette.DarkVibrant.getHex().toUpperCase());
    this.colorPalette.push(palette.LightMuted.getHex().toUpperCase());
    this.colorPalette.push(palette.LightVibrant.getHex().toUpperCase());
    this.colorPalette.push(palette.Muted.getHex().toUpperCase());
    this.colorPalette.push(palette.Vibrant.getHex().toUpperCase());

    this.colorPaletteTextColor = [];
    this.colorPaletteTextColor.push(palette.DarkMuted.getBodyTextColor());
    this.colorPaletteTextColor.push(palette.DarkVibrant.getBodyTextColor());
    this.colorPaletteTextColor.push(palette.LightMuted.getBodyTextColor());
    this.colorPaletteTextColor.push(palette.LightVibrant.getBodyTextColor());
    this.colorPaletteTextColor.push(palette.Muted.getBodyTextColor());
    this.colorPaletteTextColor.push(palette.Vibrant.getBodyTextColor());
  }
}
