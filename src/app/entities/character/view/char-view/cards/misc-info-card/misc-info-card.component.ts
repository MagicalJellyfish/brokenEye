import { ChangeDetectorRef, Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Character } from 'src/app/api-classes/Characters/Character';
import { CharEditComponent } from 'src/app/entities/character/edit/char-edit/char-edit.component';

@Component({
  selector: 'app-misc-info-card',
  templateUrl: './misc-info-card.component.html',
  styleUrls: ['./misc-info-card.component.scss']
})
export class MiscInfoCardComponent implements OnInit {

  constructor(private matDialog: MatDialog) { }

  @Input() pcSubject!: Subject<Character>
  @Input() char!: Character

  ngOnInit(): void {
    this.pcSubject.subscribe(x => { 
      this.char = x
    })
  }

  openEdit() {
    this.matDialog.open(CharEditComponent, { data: { 
      id: this.char.id, 
      name: this.char.name,
      height: this.char.height,
      weight: this.char.weight,
      age: this.char.age,
      defaultShortcut: this.char.defaultShortcut
    }})
  }
}
