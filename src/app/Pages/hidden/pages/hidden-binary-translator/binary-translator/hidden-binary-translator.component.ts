import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-hidden-binary-translator',
  templateUrl: './hidden-binary-translator.component.html',
  styleUrls: ['./hidden-binary-translator.component.css']
})
export class HiddenBinaryTranslatorComponent implements OnInit, OnDestroy {
  input: string = "";
  output: string = "";

  inputHeader: string = "Binary";
  outputHeader: string = "Text";

  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Binary Translator | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "Personal binary translator project." });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "noindex, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "noindex, follow" });
    }
  }

  ngOnDestroy() {
    this.titleService.setTitle("Random Stuff");
  }

  convert() {
    var char = "a";
    if(this.inputHeader == "Binary") {
      this.output = this.binaryToText(this.input.replace(/[^0-1]/g, ''));
    } else {
      this.output = this.textToBinary(this.input);
    }
  }

  clearInput() {
    this.input = "";
    this.output = "";
  }

  swapTranslation() {
    if(this.inputHeader == "Binary") {
      this.inputHeader = "Text";
      this.outputHeader = "Binary"
    } else {
      this.inputHeader = "Binary";
      this.outputHeader = "Text"
    }
    this.convert();
  }

  binaryToText(string) {
    if(string.length == 0) {
      return "";
    }

    return string
      .replace(/\s/g, '')
      .match(/.{1,8}/g)
      .map(
        function (byte) {
          return String.fromCharCode(parseInt(byte, 2));
        }
      )
      .join('');
  }

  textToBinary(string) {
    return string.split('').map(function (char) {
      return char.charCodeAt(0).toString(2).padStart(8, "0");
    }).join(' ');
  }

}
