import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ValueDebouncer } from 'src/app/logic/core/debouncer/debouncer';
import { Property } from 'src/app/models/character/CharacterPatch';
import { CharacterView } from 'src/app/models/character/CharacterView';
import { ApiUrlService } from 'src/app/services/api/apiUrl/api-url.service';
import { ConfirmationDialog } from 'src/app/ui/core/confirmation-dialog/confirmation.dialog';
import { CharacterApiService } from '../../character.api-service';

@Component({
  selector: 'character-flavor',
  templateUrl: './character-flavor.component.html',
  styleUrls: ['./character-flavor.component.scss'],
  imports: [
    FormsModule,
    MatCardModule,
    MatFormField,
    MatInputModule,
    NgOptimizedImage,
    MatIconModule,
    MatButtonModule,
  ],
})
export class CharacterFlavorComponent implements OnInit {
  constructor(
    protected apiUrlService: ApiUrlService,
    private apiService: CharacterApiService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.baseImageUrl =
      this.apiUrlService.url() +
      '/image/character/' +
      this.character().id +
      '?';
    new Date().getTime();
    this.imageUrl = this.baseImageUrl;
  }

  character = input.required<CharacterView>();

  description = new ValueDebouncer<string>(
    '',
    computed(() => this.character().description),
    (x) => this.saveDescription(x),
  );
  notes = new ValueDebouncer<string>(
    '',
    computed(() => this.character().notes),
    (x) => this.saveNotes(x),
  );

  age = new ValueDebouncer<number>(
    0,
    computed(() => this.character().age),
    (x) => this.saveAge(x),
  );
  height = new ValueDebouncer<number>(
    0,
    computed(() => this.character().height),
    (x) => this.saveHeight(x),
  );
  weight = new ValueDebouncer<number>(
    0,
    computed(() => this.character().weight),
    (x) => this.saveWeight(x),
  );

  imageFailed = false;
  baseImageUrl?: string;
  imageUrl?: string;

  uploadImage(inputEvent: any) {
    let image: File = inputEvent.target.files[0];

    this.apiService.uploadImage(this.character().id, image).subscribe((_) => {
      this.imageUrl = this.baseImageUrl! + new Date().getTime();
    });
  }

  deleteImage() {
    this.apiService
      .removeImage(this.character().id)
      .subscribe((_) => (this.imageUrl = 'assets/placeholder.svg'));
  }

  deleteCharacter() {
    this.dialog
      .open(ConfirmationDialog, {
        data: { message: 'Are you sure you want to delete this character?' },
      })
      .afterClosed()
      .subscribe((x) => {
        if (x) {
          this.apiService
            .deleteCharacter(this.character().id)
            .subscribe((_) => {
              this.router.navigate(['']);
            });
        }
      });
  }

  saveDescription(description: string) {
    this.saveValue(Property.Description, description);
  }

  saveNotes(notes: string) {
    this.saveValue(Property.Notes, notes);
  }

  saveAge(age: number) {
    this.saveValue(Property.Age, age);
  }

  saveHeight(height: number) {
    this.saveValue(Property.Height, height);
  }

  saveWeight(weight: number) {
    this.saveValue(Property.Weight, weight);
  }

  saveValue(property: Property, value: any) {
    this.apiService
      .patchCharacter(this.character().id, [
        { targetProperty: property, value: value },
      ])
      .subscribe();
  }
}
