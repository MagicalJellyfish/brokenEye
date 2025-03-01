import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { Character } from 'src/app/api-classes/Characters/Character';
import { RequestService } from 'src/app/services/entities/request/request.service';

@Component({
  selector: 'app-misc-char-card',
  templateUrl: './misc-char-card.component.html',
  styleUrls: ['./misc-char-card.component.scss'],
  imports: [
    MatCard,
    MatCardContent,
    MatTabGroup,
    MatTab,
    MatFormField,
    MatLabel,
    MatInput,
    CdkTextareaAutosize,
    FormsModule,
    MatButton,
  ],
})
export class MiscCharCardComponent implements OnInit {
  constructor(private requestService: RequestService) {}

  @Input() pcSubject!: Subject<Character>;
  @Input() char!: Character;

  ngOnInit(): void {
    this.update();

    this.pcSubject.subscribe((x) => {
      this.char = x;
      this.update();
    });

    /* this.descriptionDebouncer.OutputSubject.subscribe(() =>
      this.updateDescription()
    );
    this.notesDebouncer.OutputSubject.subscribe(() => this.updateNotes()); */
  }

  update() {
    var charCodeString: string = '';
    for (var i = 0; i < this.char.image.bytes.length; i++) {
      charCodeString += String.fromCharCode(this.char.image.bytes[i]);
    }
    this.image = btoa(charCodeString);

    /* if (!this.descriptionDebouncer.Debouncing) {
      this.description = this.char.description;
    }
    if (!this.notesDebouncer.Debouncing) {
      this.notes = this.char.notes;
    } */
  }

  image: string = '';

  description = '';
  /* descriptionDebouncer = new Debouncer(); */

  notes = '';
  /* notesDebouncer = new Debouncer(); */

  updateImage(inputEvent: any) {
    let file: File = inputEvent.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e: any) => {
        let resultString: string = reader.result as string;

        var binaryString = atob(resultString.substring(22));
        var byteArray: number[] = [];
        for (var i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }

        (
          await this.requestService.patch(
            this.requestService.routes.characterImage,
            this.char.imageId,
            JSON.stringify({
              bytes: byteArray,
            })
          )
        ).subscribe();
      };

      reader.readAsDataURL(file);
    }
  }

  async updateDescription() {
    (
      await this.requestService.patch(
        this.requestService.routes.character,
        this.char.id,
        JSON.stringify({
          description: this.description,
        })
      )
    ).subscribe();
  }

  async updateNotes() {
    (
      await this.requestService.patch(
        this.requestService.routes.character,
        this.char.id,
        JSON.stringify({
          notes: this.notes,
        })
      )
    ).subscribe();
  }

  async removeImage() {
    (
      await this.requestService.patch(
        this.requestService.routes.characterImage,
        this.char.imageId,
        JSON.stringify({
          bytes: [],
        })
      )
    ).subscribe();
  }
}
