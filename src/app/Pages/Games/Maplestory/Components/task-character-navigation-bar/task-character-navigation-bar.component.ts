import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskData } from '../../Models/taskModels';


@Component({
  selector: 'app-task-character-navigation-bar',
  templateUrl: './task-character-navigation-bar.component.html',
  styleUrls: ['./task-character-navigation-bar.component.css']
})
export class CharacterNavigationBarComponent {
  @Input() taskData: TaskData;

  @Output() changeEvent = new EventEmitter<any>();


  changeCharacter(index: number) {
    this.taskData.selectedCharacterIndex = index;

    // save the changes
    this.changeHandler();
  }

  changeHandler() {
    this.changeEvent.emit();
  }
}