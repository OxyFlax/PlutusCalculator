import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hidden-timer',
  templateUrl: './hidden-timer.component.html',
  styleUrls: ['./hidden-timer.component.css']
})
export class HiddenTimerComponent implements OnInit {
  audio = new Audio();
  volume: number = 0.5;

  constructor() {
  }

  ngOnInit() {
    this.audio.src = "assets/hidden/timer/oof.mp3";

    // load in save volume
    this.volume = localStorage.getItem('theme') ? JSON.parse(localStorage.getItem("siteVolume")) : 0.5;
    this.audio.volume = this.volume;
  }

  updateVolume(){
    // update the volume to the user selected volume;
    this.audio.volume = this.volume;
    // save the volume
    localStorage.setItem("siteVolume", JSON.stringify(this.volume));
    // reset the time incase it is currently being played
    this.audio.currentTime = 0;
    this.audio.play();
    console.log(this.volume);
  }
}
