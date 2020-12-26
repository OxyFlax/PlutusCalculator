import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-hidden-hexrgb-converter',
  templateUrl: './hidden-hexrgb-converter.component.html',
  styleUrls: ['./hidden-hexrgb-converter.component.css']
})
export class HiddenHexRGBConverterComponent implements OnInit, OnDestroy {
  inputSetToHex: boolean = true;

  hexInput: string = "";

  rgbRedInput: number = null;
  rgbGreenInput: number = null;
  rgbBlueInput: number = null;

  hexOutput: string = "";
  rgbOutput: string = "";

  color: string = "";

  colorShades: any[] = new Array(11);
  colorTints: any[] = new Array(11);

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
    if (this.inputSetToHex) {
      this.inputSetToHex = false;
    } else {
      this.inputSetToHex = true;
    }
    this.clearInput();
  }

  convert() {
    if (this.inputSetToHex) {
      //convert hex to rgb, if it returns a value format the output and generate shades. Otherwise show null (prevents errors where red green & blue do not exist)
      var rgbValues = this.hexToRGB(this.hexInput);
      if(rgbValues) {
        this.rgbOutput = "rgb(" + rgbValues.red + ", " + rgbValues.green + ", " + rgbValues.blue + ")";
        this.createTintsAndShades(this.hexInput);
      } else {
        this.rgbOutput = null;
        this.clearShadesAndTintsOutput();
      }
      this.color = this.rgbOutput;
    } else {
      //convert rgb to hex, format the output and generate shades
      this.hexOutput = "#" + this.rgbToHex(this.rgbRedInput, this.rgbGreenInput, this.rgbBlueInput);
      this.createTintsAndShades(this.hexOutput);
      this.color = this.hexOutput;
    }
  }

  createTintsAndShades(hexColor) {
    // convert the hexcolor to rgb to allow the calculations to work
    var rgbColor = this.hexToRGB(hexColor);

    // calculate an array of shades from the input color
    this.colorShades = this.calculateShades(rgbColor);

    // calculate an array of tints from the input color
    this.colorTints = this.calculateTints(rgbColor);
  }

  calculateShades(color) {
    var shadeValues = [];

    for (var i = 0; i < 10; i++) {
      shadeValues[i] = "#" + this.rgbToHex(color.red * (1 - 0.1 * i), color.green * (1 - 0.1 * i), color.blue * (1 - 0.1 * i));
    }

    shadeValues.push("#000000");

    return shadeValues;
  }

  calculateTints(color) {
    var tintValues = [];

    for (var i = 0; i < 10; i++) {
      tintValues[i] = "#" + this.rgbToHex(color.red + (255 - color.red) * i * 0.1, color.green + (255 - color.green) * i * 0.1, color.blue + (255 - color.blue) * i * 0.1);
    }

    tintValues.push("#FFFFFF");

    return tintValues;
  }

  hexToRGB(hexInput) {
    var parsedInput = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexInput);
    if (parsedInput) {
      return {
        red: parseInt(parsedInput[1], 16),
        green: parseInt(parsedInput[2], 16),
        blue: parseInt(parsedInput[3], 16)
      }
    }
    return null;
  }

  rgbToHex(r, g, b) {
    var returnValue: string = this.intToHex(r) + this.intToHex(g) + this.intToHex(b);
    return returnValue.toUpperCase();
  }

  intToHex(rgbint) {
    return this.pad(Math.min(Math.max(Math.round(rgbint), 0), 255).toString(16), 2);
  }

  pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }

  clearInput() {
    this.hexInput = "";

    this.rgbRedInput = null;
    this.rgbGreenInput = null;
    this.rgbBlueInput = null;

    this.hexOutput = "";
    this.rgbOutput = "";

    this.color = "";

    this.clearShadesAndTintsOutput();
  }

  clearShadesAndTintsOutput() {
    this.colorShades = new Array(11);
    this.colorTints = new Array(11);
  }
}
