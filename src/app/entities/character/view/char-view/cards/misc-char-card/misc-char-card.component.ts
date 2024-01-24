import { Component, Input, OnInit } from '@angular/core';
import { Subject, buffer, debounceTime, distinctUntilChanged, timeout, timer } from 'rxjs';
import { PlayerCharacter } from 'src/app/api-classes/Characters/PlayerCharacter';
import { RequestService } from 'src/app/services/entities/request/request.service';

@Component({
  selector: 'app-misc-char-card',
  templateUrl: './misc-char-card.component.html',
  styleUrls: ['./misc-char-card.component.scss']
})
export class MiscCharCardComponent implements OnInit {

  constructor(private requestService: RequestService) { }

  @Input() pcSubject!: Subject<PlayerCharacter>
  @Input() char!: PlayerCharacter

  ngOnInit(): void {
    this.update()
    
    this.pcSubject.subscribe(x => { 
      this.char = x
      this.update()
    })

    this.descriptionDebounce.subscribe(_ => this.descriptionDebouncing = true)
    this.descriptionDebounce.pipe(
      debounceTime(2000),
      distinctUntilChanged())
      .subscribe(_ => {
        this.updateDescription()
      });

    this.notesDebounce.subscribe(_ => this.notesDebouncing = true)
    this.notesDebounce.pipe(
      debounceTime(2000),
      distinctUntilChanged())
      .subscribe(_ => {
        this.updateNotes()
      });
  }

  update() {
    var charCodeString: string = ""
    for(var i = 0; i < this.char.image.length; i++) {
      charCodeString += String.fromCharCode(this.char.image[i])
    }
    this.image = btoa(charCodeString)

    if(!this.descriptionDebouncing) {
      this.description = this.char.description
    }
    if(!this.notesDebouncing) {
      this.notes = this.char.notes
    }
  }

  image: string = ""
  
  description = ""
  descriptionDebounce = new Subject<string>();
  descriptionDebouncing = false

  notes = ""
  notesDebounce = new Subject<string>();
  notesDebouncing = false

  updateImage(inputEvent: any) {
    let file: File = inputEvent.target.files[0]

    if(file) {
      const reader = new FileReader();

      reader.onload = async (e: any) => {
        let resultString: string = reader.result as string

        var binaryString = atob(resultString.substring(22));
        var byteArray: number[] = [];
        for (var i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }

        (await this.requestService.patch(this.requestService.routes.playerCharacter, this.char.id, JSON.stringify({
          "image": byteArray
        }))).subscribe()
      };

      reader.readAsDataURL(file);
    }
  }

  async updateDescription() {
    (await this.requestService.patch(this.requestService.routes.playerCharacter, this.char.id, JSON.stringify({
      "description": this.description
    }))).subscribe()
    this.descriptionDebouncing = false
  }

  async updateNotes() {
    (await this.requestService.patch(this.requestService.routes.playerCharacter, this.char.id, JSON.stringify({
      "notes": this.notes
    }))).subscribe()
    this.notesDebouncing = false
  }
}
