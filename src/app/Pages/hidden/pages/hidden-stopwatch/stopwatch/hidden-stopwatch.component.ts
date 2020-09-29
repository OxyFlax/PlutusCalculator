import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-hidden-timer',
  templateUrl: './hidden-stopwatch.component.html',
  styleUrls: ['./hidden-stopwatch.component.css']
})
export class HiddenStopwatchComponent implements OnInit, OnDestroy {
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  milliseconds: number = 0;

  stopwatchInterval: any;
  stopwatchMessage: string = "start";
  startTime: number = 0;
  totalTime: number = 0;
  savedTime: number = 0;

  constructor(private titleService: Title, private metaService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("Stopwatch | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "Personal stopwatch project."});
    if(!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "noindex, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "noindex, follow" });
    }
  }

  ngOnDestroy() {
    if (this.stopwatchInterval) {
      clearInterval(this.stopwatchInterval);
    }
  }

  startStopButton() {
    // stop the stopwatch if its active otherwise start it;
    if (this.stopwatchInterval) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    this.startTime = new Date().getTime();
    //this.startTime -= 1000*60*60;
    this.stopwatchMessage = "stop";
    this.stopwatchInterval = setInterval(() => { this.calculateAndOutPutTime(), 10 });
  }

  stop() {
    clearInterval(this.stopwatchInterval);
    this.stopwatchInterval = undefined;

    this.stopwatchMessage = "start";
    this.savedTime = this.totalTime;
  }

  reset() {
    clearInterval(this.stopwatchInterval);
    this.stopwatchInterval = undefined;

    this.stopwatchMessage = "start";
    this.startTime = 0;
    this.savedTime = 0;
    this.totalTime = 0;

    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
  }

  calculateAndOutPutTime() {
    var currentTime = new Date().getTime();
    if (this.savedTime != 0) {
      this.totalTime = (currentTime - this.startTime) + this.savedTime;
    } else {
      this.totalTime = currentTime - this.startTime;
    }

    this.hours = Math.floor((this.totalTime / (1000 * 60 * 60)));
    this.minutes = Math.floor((this.totalTime % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((this.totalTime % (1000 * 60)) / 1000);
    this.milliseconds = Math.floor((this.totalTime % (1000)) / 10);
  }
}
