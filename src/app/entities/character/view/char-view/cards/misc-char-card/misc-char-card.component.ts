import { Component, Input, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Character } from 'src/app/api-classes/Characters/Character';
import { Debouncer } from 'src/app/core/debouncer/debouncer';
import { RequestService } from 'src/app/services/entities/request/request.service';

@Component({
  selector: 'app-misc-char-card',
  templateUrl: './misc-char-card.component.html',
  styleUrls: ['./misc-char-card.component.scss'],
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

    this.descriptionDebouncer.SaveSubject.subscribe(() =>
      this.updateDescription()
    );
    this.notesDebouncer.SaveSubject.subscribe(() => this.updateNotes());
  }

  update() {
    var charCodeString: string = '';
    for (var i = 0; i < this.char.image.length; i++) {
      charCodeString += String.fromCharCode(this.char.image[i]);
    }
    this.image = btoa(charCodeString);

    if (!this.descriptionDebouncer.Debouncing) {
      this.description = this.char.description;
    }
    if (!this.notesDebouncer.Debouncing) {
      this.notes = this.char.notes;
    }
  }

  image: string = '';

  description = '';
  descriptionDebouncer = new Debouncer();

  notes = '';
  notesDebouncer = new Debouncer();

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
            this.requestService.routes.character,
            this.char.id,
            JSON.stringify({
              image: byteArray,
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
}
