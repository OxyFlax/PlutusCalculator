import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskData } from '../../Models/taskModels';


@Component({
  selector: 'app-task-character-navigation-bar',
  templateUrl: './task-character-navigation-bar.component.html',
  styleUrls: ['./task-character-navigation-bar.component.css']
})
export class CharacterNavigationBarComponent {
  @Input() taskData: TaskData;
  @Input() editModeActive: boolean;

  @Output() changeEvent = new EventEmitter<any>();
  @Output() addCharacterEvent = new EventEmitter<any>();


  changeCharacter(index: number) {
    this.taskData.selectedCharacterIndex = index;

    // save the changes
    this.changeHandler();
  }

  addCharacter() {
    if (this.taskData.characters.length < 20) {
      // emit the event back to the main compoment as we need the original JSON to create new character data
      this.addCharacterEvent.emit();
    } else {
      window.alert("You have reached the limit of 20 characters.\nI really hope you don't actually have this many characters to track...");
    }
  }

  removeCharacter(index: number) {
    // if editmode isn't active exit out of this function
    if(!this.editModeActive) {
      return;
    }

    // prevent deletion if there is only one character left
    if(this.taskData.characters.length > 1) {
      if(window.confirm("Are sure you want to delete '" + this.taskData.characters[index].characterName + "'?")){
        // adjust the selectedCharacterIndex for the best userexperience and to prevent it from being out of bounds if removing while the last character is selected
        if (this.taskData.selectedCharacterIndex >= this.taskData.characters.length - 1) {
          this.taskData.selectedCharacterIndex = this.taskData.selectedCharacterIndex - 1;
        } else if (this.taskData.selectedCharacterIndex == 0) {
          // do nothing
        } else if (index < this.taskData.selectedCharacterIndex) {
          this.taskData.selectedCharacterIndex = this.taskData.selectedCharacterIndex - 1;
        }

        //remove the character from the array and trigger the changeHandler
        this.taskData.characters.splice(index, 1);
        this.changeHandler();
       }
    } else {
      window.alert("Cannot remove this character as the minimum character count is one.");
    }
  }

  changeHandler() {
    this.changeEvent.emit();
  }
}