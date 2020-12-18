import { Component, OnInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AudioType } from '../../../models/audioType';

@Component({
  selector: 'app-hidden-timer',
  templateUrl: './hidden-timer.component.html',
  styleUrls: ['./hidden-timer.component.css']
})
export class HiddenTimerComponent implements OnInit, OnDestroy {
  @ViewChild("inputField") inputField: ElementRef;
  previewAudio = new Audio();
  fullAudio = new Audio();
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
  timerMessage: string = "start";


  constructor(private titleService: Title, private metaService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("Timer | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "Personal timer project."});
    if(!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "noindex, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "noindex, follow" });
    }

    this.loadAudio();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.titleService.setTitle("Random Stuff");
  }

  loadAudio() {
    // load in saved volume
    this.volume = localStorage.getItem('siteVolume') ? JSON.parse(localStorage.getItem("siteVolume")) : 0.5;
    // apply saved volume and set audio src so it's available when the tab isn't focussed
    this.previewAudio.volume = this.volume;
    this.previewAudio.src = "assets/hidden/timer/PreviewSound.mp3";
    this.fullAudio.volume = this.volume;
    this.fullAudio.src = "assets/hidden/timer/FullSound.mp3";
  }

  updateVolume() {
    // update the volume to the user selected volume;
    this.previewAudio.volume = this.volume;
    this.fullAudio.volume = this.volume;
    // save the volume
    localStorage.setItem("siteVolume", JSON.stringify(this.volume));
    // play the audio so the user can test the selected volume
    this.playAudio(AudioType.Preview);

  }

  playAudio(type: AudioType) {
    if (type == AudioType.Preview) {
      // reset the time incase it is currently being played or has progress after being paused
      this.previewAudio.currentTime = 0;
      this.previewAudio.play();
    }

    if (type == AudioType.Full) {
      // reset the time incase it is currently being played or has progress after being paused
      this.fullAudio.currentTime = 0;
      this.fullAudio.play();
    }
  }

  stopAudio() {
    this.fullAudio.pause();
  }

  timeInputHandler(event: any) {
    // if the user did any sort of input the timeOutputString is considered dirty
    this.timeOutputStringIsDirty = true;

    // reset output vars and exit out the method if there is no value present
    if (event.data == null && event.target.value != 1) {
      if (event.inputType != "deleteContentBackward") {
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
    if (this.timeInput == null) {
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
    this.setCursorToTheEnd();
    this.timerMessage = "start";

    if (this.timer) {
      this.titleService.setTitle("Random Stuff");
      this.stopTimer();
    }
  }

  focusOut() {
    // no need to do any of this if the element already isn't focussed
    if (!this.timeInputFocussed) {
      return;
    }
    this.inputField.nativeElement.blur();
    this.timeInputFocussed = false;

    this.calculateActualTime();
  }

  calculateActualTime() {
    // if the timeoutputstring isn't dirty aka it hasn't been edited by the user, exit the function since the h m s & ms are still correct
    if (!this.timeOutputStringIsDirty) {
      return;
    }

    this.hours = parseInt(this.timeOutputString.substr(0, 2));
    this.minutes = parseInt(this.timeOutputString.substr(2, 2));
    this.seconds = parseInt(this.timeOutputString.substr(4, 2));

    // limits the amount of seconds to not exceed a minute
    if (this.seconds >= 60) {
      this.seconds = this.seconds % 60;
      this.minutes++
    }

    // limits the amount of minutes to not exceed an hour
    if (this.minutes >= 60) {
      this.minutes = this.minutes % 60;
      this.hours++
    }

    // if the amount of hours exceeds 99 the countdown vars are set to their max supported value
    if (this.hours > 99) {
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

  startStopButton() {
    // this will only run if the user edited the input value so it doesn't pose a problem for restarting the timer
    this.calculateActualTime();

    // stopping of the timer if its active;
    if (this.timer) {
      this.titleService.setTitle("Random Stuff");
      this.stopTimer();
      this.timerMessage = "start";
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    // this prevents restarting the timer with effectively 0 seconds once it has finished
    if (this.totalMilliseconds == 0) {
      return;
    }

    var date = new Date();
    this.startTimeEpoch = date.getTime();
    var endTime = this.startTimeEpoch + this.totalMilliseconds;

    this.timerMessage = "stop";
    this.calculateAndOutPutTime(endTime - new Date().getTime());

    this.timer = setInterval(() => {
      var distance = endTime - new Date().getTime();
      this.calculateAndOutPutTime(distance);
      if (distance <= 0) {
        this.stopTimer();
        // play end sound
        this.playAudio(AudioType.Full);
        this.timerMessage = "ok";
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timer = undefined;

    var endTimeEpoch = new Date().getTime();
    var elapsedMilliseconds = Math.round((endTimeEpoch - this.startTimeEpoch) / 1000) * 1000
    this.totalMilliseconds = this.totalMilliseconds - (elapsedMilliseconds);
  }

  resetTimer() {
    if (this.timer) {
      this.stopTimer();
    }

    this.timerMessage = "start";
    this.titleService.setTitle("Random Stuff");
    // incase it is playing when the user clicks on reset
    this.stopAudio();

    // restore values for restarting the timer
    this.timeOutputString = this.hours.toString().padStart(2, "0") + this.minutes.toString().padStart(2, "0") + this.seconds.toString().padStart(2, "0");
    this.timeInput = parseInt(this.timeOutputString);
    this.totalMilliseconds = ((this.hours * 60 * 60) + (this.minutes * 60) + this.seconds) * 1000;
  }

  calculateAndOutPutTime(distance: number) {
    if (distance < 0) {
      distance = 0;
    } else {
      // +50ms to prevent visual timer skipping due to 1-2 millisecond differences between the triggering (like: 2999 -> 3001 -> 2998)
      distance = distance + 50;
    }

    var hours = Math.floor((distance / (1000 * 60 * 60)));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.timeOutputString = hours.toString().padStart(2, "0") + minutes.toString().padStart(2, "0") + seconds.toString().padStart(2, "0");
    this.timeInput = parseInt(this.timeOutputString);

    this.outputPageTitle(hours, minutes, seconds, distance);
  }

  outputPageTitle(hours: number, minutes: number, seconds: number, distance: number) {
    if (distance != 0) {
      var outputString = "";
      if (hours != 0) {
        outputString += hours.toString() + "h ";
        outputString += minutes.toString().padStart(2, "0") + "m ";
        outputString += seconds.toString().padStart(2, "0") + "s";
        this.titleService.setTitle(outputString);
        return;
      }

      if (minutes != 0) {
        outputString += minutes.toString().padStart(2, "0") + "m ";
        outputString += seconds.toString().padStart(2, "0") + "s";
        this.titleService.setTitle(outputString);
        return;
      }

      this.titleService.setTitle(seconds + "s");
    } else {
      this.titleService.setTitle("It's over");
    }
  }

  setCursorToTheEnd() {
    // If this function exists... (IE 9+)
    if (this.inputField.nativeElement.setSelectionRange) {

      // Double the length because Opera is inconsistent about whether a carriage return is one character or two.
      var len = this.timeInput.toString().length * 2;

      // Timeout seems to be required for Blink
      setTimeout(() => {
        // temporarily change the type to text because type number doesn't support setSelectionRange
        this.inputField.nativeElement.type = "text";
        this.inputField.nativeElement.setSelectionRange(len, len);
        this.inputField.nativeElement.type = "number";
      }, 1);

    } else {

      // As a fallback, replace the contents with itself
      // Doesn't work in Chrome, but Chrome supports setSelectionRange
      this.timeInput = this.timeInput
    }
  }


  // TODO: decide if enter to start the time is needed or not if so fix the issues the blow code still has
  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) { 
  //   // prevents a helddown key from being counted more than once
  //   if (event.repeat) { return }
  //   if (event.key == "Unidentified") { return }

  //   if(event.key == "Enter" && !this.timeInputFocussed) {
  //     console.log("enter pressed while timeInput not in focus");
  //     console.log(this.timer);
  //     event.stopPropagation();
  //   }
  // }
}
