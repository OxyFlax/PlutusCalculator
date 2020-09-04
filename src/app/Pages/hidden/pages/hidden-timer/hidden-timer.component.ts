import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hidden-timer',
  templateUrl: './hidden-timer.component.html',
  styleUrls: ['./hidden-timer.component.css']
})
export class HiddenTimerComponent implements OnInit, OnDestroy {
  @ViewChild("inputField") inputField: ElementRef;
  audio = new Audio();
  volume: number = 0.5;

  timeInputFocussed: boolean = false;
  timeInput: number = 500;
  timeOutputString: string = "000500";
  timeOutputStringIsDirty: boolean = false;

  hours: number = 0;
  minutes: number = 5;
  seconds: number = 0;

  totalMilliseconds: number = 300000;
  startTimeEpoch: number;
  timer: any;


  constructor() {
  }

  ngOnInit() {
    this.audio.src = "assets/hidden/timer/oof.mp3";

    // load in saved volume
    this.volume = localStorage.getItem('theme') ? JSON.parse(localStorage.getItem("siteVolume")) : 0.5;
    this.audio.volume = this.volume;
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  updateVolume() {
    // update the volume to the user selected volume;
    this.audio.volume = this.volume;
    // save the volume
    localStorage.setItem("siteVolume", JSON.stringify(this.volume));
    // reset the time incase it is currently being played
    this.audio.currentTime = 0;
    this.audio.play();
  }

  timeInputHandler(event: any) {
    // if the user did any sort of input the timeOutputString is considered dirty
    this.timeOutputStringIsDirty = true;

    // reset output vars and exit out the method if there is no value present
    if (event.data == null && event.target.value != 1) {
      if(event.inputType != "deleteContentBackward") {
        return;
      }
    }

    // if data was pasted in clear the input and exit method
    if (event.inputType == "insertFromPaste") {
      event.target.value = '';
      return;
    }

    // prevents input of various symbols
    if (isNaN(event.data)) {
      event.target.value = '';
      this.timeInput = 1;
    }

    // prevents the output values from displaying null;
    if(this.timeInput == null) {
      this.timeInput = 0;
    }

    // convert the input number to an output version to display to the user
    this.timeOutputString = ("000000" + this.timeInput).substr(-6, 6)
    // convert the display number back to the an int to get value of the 6 last numbers the user inputted
    this.timeInput = parseInt(this.timeOutputString);

    // prevents the input number from becomming too large
    if (event.target.value > 999999) {
      event.target.value = this.timeInput;
    }
  }

  focusInput() {
    this.inputField.nativeElement.focus();
    this.timeInputFocussed = true;
  }

  focusOut(){
    // no need to do any of this if the element already isn't focussed
    if(!this.timeInputFocussed) {
      return;
    }
    this.inputField.nativeElement.blur();
    this.timeInputFocussed = false;

    this.calculateActualTime();
  }

  calculateActualTime(){
    // if the timeoutputstring isn't dirty aka it hasn't been edited by the user, exit the function since the h m s & ms are still correct
    if(!this.timeOutputStringIsDirty) {
      return;
    }

    this.hours = parseInt(this.timeOutputString.substr(0,2));
    this.minutes = parseInt(this.timeOutputString.substr(2,2));
    this.seconds = parseInt(this.timeOutputString.substr(4,2));

    // limits the amount of seconds to not exceed a minute
    if(this.seconds >= 60) {
      this.seconds = this.seconds % 60;
      this.minutes++
    }

    // limits the amount of minutes to not exceed an hour
    if(this.minutes >= 60) {
      this.minutes = this.minutes % 60;
      this.hours++
    }

    // if the amount of hours exceeds 99 the countdown vars are set to their max supported value
    if(this.hours > 99) {
      this.hours = 99;
      this.minutes = 59;
      this.seconds = 59;
    }

    // calculate the total milliseconds these h m s are combined
    this.totalMilliseconds = ((this.hours * 60 * 60) + (this.minutes * 60) + this.seconds) * 1000;

    // set the output to the newly calculated hours minutes and seconds
    this.timeOutputString = this.hours.toString().padStart(2, "0") + this.minutes.toString().padStart(2, "0") + this.seconds.toString().padStart(2, "0");
    this.timeInput = parseInt(this.timeOutputString);

    // mark the timeOutputString as not dirty
    this.timeOutputStringIsDirty = false;
  }

  startStopTimer() {
    // this will only run if the user edited the input value so it doesn't pose a problem for restarting the timer
    this.calculateActualTime();

    // if for somereason it is still running clear it to make sure
    clearInterval(this.timer);
    var date = new Date();
    this.startTimeEpoch = date.getTime() - 1000;
    var endTime = this.startTimeEpoch + this.totalMilliseconds;

    this.calculateAndOutPutTime(endTime - new Date().getTime());

    this.timer = setInterval(() => {
      var distance = endTime - new Date().getTime();
      this.calculateAndOutPutTime(distance);
      if (distance <= 0) {
        // stop the timer
        clearInterval(this.timer);
        // TODO: move this and some other needed things into a seperate method to call playSound();
        this.audio.play();
      }
    }, 1000);

    //start timer obv
    // TODO's:
    // DONE track the epoch start time for the timer.
    // DONE countdown to the current epoch time + the var previously mentioned (this is to ensure the timer doesn't drift off due to small ms differences between setintervals)

    // updating outputstring
    // TODO's:
    // ensure the timeInput var is updated accordingly incase the user stops the timer and decides to edit the value

    //stopping timer logic
    // TODO's:
    // when stopping grab the current epoch time
    // subtract the current epoch time from the start epoch time
    // subtract the difference of those 2 epoch times from the total miliseconds to countdown
    // this ensures the timer can be restarted with the new miliseconds var inmind
  }

  resetTimer() {
    //reset the displayed values to the saved h m s & reset the timeinput var
  }

  calculateAndOutPutTime(distance: number) {
    if (distance < 0) {
      distance = 0;
    }
    // +50ms to prevent visual timer skipping due to 1-2 millisecond differences between the triggering
    distance = distance + 50;

    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.timeOutputString = hours.toString().padStart(2, "0") + minutes.toString().padStart(2, "0") + seconds.toString().padStart(2, "0");
    this.timeInput = parseInt(this.timeOutputString);
  }
}
