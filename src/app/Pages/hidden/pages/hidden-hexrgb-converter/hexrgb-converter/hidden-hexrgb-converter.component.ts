import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-hidden-hexrgb-converter',
  templateUrl: './hidden-hexrgb-converter.component.html',
  styleUrls: ['./hidden-hexrgb-converter.component.css']
})
export class HiddenHexRGBConverterComponent implements OnInit, OnDestroy {
  inputIsHex: boolean = true;

  hexInput: string = "";

  rgbRedInput: number = null;
  rgbGreenInput: number = null;
  rgbBlueInput: number = null;

  hexOutput: string = "";
  rgbOutput: string = "";

  color: string = "";

  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Hex & RGB Converter | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "Personal Hex & RGB converter." });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "noindex, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "noindex, follow" });
    }
  }

  ngOnDestroy() {
    this.titleService.setTitle("Random Stuff");
  }

  swapConversion() {
    if (this.inputIsHex) {
      this.inputIsHex = false;
    } else {
      this.inputIsHex = true;
    }
    this.clearInput();
  }

  convert() {
    if (this.inputIsHex) {
      //convert hex to rgb
      this.rgbOutput = this.hexToRGB(this.hexInput);
      this.color = this.rgbOutput;
    } else {
      // ensure the rgb input isn't below 0
      this.rgbRedInput = this.rgbRedInput < 0 ? 0 : this.rgbRedInput;
      this.rgbGreenInput = this.rgbGreenInput < 0 ? 0 : this.rgbGreenInput;
      this.rgbBlueInput = this.rgbBlueInput < 0 ? 0 : this.rgbBlueInput;

      // ensure the rgb input isn't above 255
      this.rgbRedInput = this.rgbRedInput > 255 ? 255 : this.rgbRedInput;
      this.rgbGreenInput = this.rgbGreenInput > 255 ? 255 : this.rgbGreenInput;
      this.rgbBlueInput = this.rgbBlueInput > 255 ? 255 : this.rgbBlueInput;

      //convert rgb to hex
      this.hexOutput = this.RGBToHex(this.rgbRedInput, this.rgbGreenInput, this.rgbBlueInput);
      this.color = this.hexOutput;
    }
  }

  hexToRGB(hexInput) {
    var parsedInput = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexInput);
    if(parsedInput) {
      var output = "rgb(" + parseInt(parsedInput[1], 16) + ", " + parseInt(parsedInput[2], 16) + ", " + parseInt(parsedInput[3], 16) + ")";
      return output;
    }
    return null;
  }


  RGBToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  }

  clearInput() {
    this.hexInput = "";

    this.rgbRedInput = null;
    this.rgbGreenInput = null;
    this.rgbBlueInput = null;

    this.hexOutput = "";
    this.rgbOutput = "";

    this.color = "";
  }
}
