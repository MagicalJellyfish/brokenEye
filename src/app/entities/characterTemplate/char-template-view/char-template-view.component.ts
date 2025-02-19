import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CharacterTemplate } from 'src/app/api-classes/Characters/CharacterTemplate';
import { Stat } from 'src/app/api-classes/Stats/Stat';
import { StatValue } from 'src/app/api-classes/Stats/StatValue';
import { Debouncer } from 'src/app/logic/core/debouncer/debouncer';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { ConfirmationDialogComponent } from 'src/app/ui/parts/confirmation-dialog/confirmation-dialog.component';
import { TemplateTabComponent } from '../../templates/template-tab/template-tab.component';

@Component({
  selector: 'app-char-template-view',
  templateUrl: './char-template-view.component.html',
  styleUrls: ['./char-template-view.component.scss'],
  imports: [
    NgIf,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatProgressSpinner,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    MatError,
    MatCheckbox,
    MatSuffix,
    CdkTextareaAutosize,
    MatTable,
    MatColumnDef,
    MatCellDef,
    MatCell,
    MatRowDef,
    MatRow,
    MatButton,
    MatTabGroup,
    MatTab,
    TemplateTabComponent,
    MatCardActions,
  ],
})
export class CharTemplateViewComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    protected requestService: RequestService,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    (
      await this.requestService.getAll(
        this.requestService.routes.constant + '/Stats'
      )
    ).subscribe((stats: any) => {
      this.allStats = stats;
    });

    this.nameDebouncer.SaveSubject.subscribe(() => this.saveName());
    this.heightDebouncer.SaveSubject.subscribe(() => this.saveHeight());
    this.weightDebouncer.SaveSubject.subscribe(() => this.saveWeight());
    this.ageDebouncer.SaveSubject.subscribe(() => this.saveAge());
    this.moneyDebouncer.SaveSubject.subscribe(() => this.saveMoney());
    this.experienceDebouncer.SaveSubject.subscribe(() => this.saveExperience());
    this.descriptionDebouncer.SaveSubject.subscribe(() =>
      this.saveDescription()
    );
    this.notesDebouncer.SaveSubject.subscribe(() => this.saveNotes());

    (
      await this.requestService.get(
        this.requestService.routes.characterTemplate,
        +this.route.snapshot.paramMap.get('id')!
      )
    ).subscribe((x: any) => {
      this.charTemplate = x;

      this.update();
    });

    this.changeSubject.subscribe((_) => {
      this.update();
    });
  }

  update() {
    this.statValues = [];
    let statIncreases: StatValue[] = [];

    this.charTemplate?.effectTemplates.forEach((effectTemplate) => {
      effectTemplate.statIncreases.forEach((statIncrease) => {
        statIncreases.push(statIncrease);
      });
    });

    this.charTemplate?.traitTemplates.forEach((traitTemplate) => {
      traitTemplate.statIncreases.forEach((statIncrease) => {
        statIncreases.push(statIncrease);
      });
    });

    this.charTemplate?.itemTemplates.forEach((itemTemplate) => {
      itemTemplate.statIncreases.forEach((statIncrease) => {
        for (let i = 0; i < itemTemplate.amount; i++) {
          statIncreases.push(statIncrease);
        }
      });
    });

    this.allStats.forEach((stat) => {
      let totalIncrease = 0;
      let relevantStatIncreases = statIncreases.filter(
        (x) => x.statId == stat.id
      );
      relevantStatIncreases.forEach((relevantStatIncrease) => {
        totalIncrease += relevantStatIncrease.value;
      });

      let newValue: StatValue = {
        id: 0,
        stat: stat,
        value: totalIncrease,
      };
      this.statValues.push(newValue);
    });

    this.statTable = new MatTableDataSource(this.statValues);

    var charCodeString: string = '';
    for (var i = 0; i < this.charTemplate!.image.length; i++) {
      charCodeString += String.fromCharCode(this.charTemplate!.image[i]);
    }
    this.image = btoa(charCodeString);

    if (!this.experienceDebouncer.Debouncing) {
      this.experience = this.charTemplate!.experience;
    }
    if (!this.descriptionDebouncer.Debouncing) {
      this.description = this.charTemplate!.description;
    }
    if (!this.notesDebouncer.Debouncing) {
      this.notes = this.charTemplate!.notes;
    }

    if (!this.nameDebouncer.Debouncing) {
      this.name.setValue(this.charTemplate!.name);
    }

    if (!this.nameDebouncer.Debouncing) {
      this.money.setValue(this.charTemplate!.money.toString());
    }

    if (!this.heightDebouncer.Debouncing) {
      let height = null;
      if (this.charTemplate!.height != undefined)
        height = this.charTemplate!.height.toString();
      this.height.setValue(height);
    }

    if (!this.weightDebouncer.Debouncing) {
      let weight = null;
      if (this.charTemplate!.weight != undefined)
        weight = this.charTemplate!.weight.toString();
      this.weight.setValue(weight);
    }

    if (!this.ageDebouncer.Debouncing) {
      let age = null;
      if (this.charTemplate!.age != undefined)
        age = this.charTemplate!.age.toString();
      this.age.setValue(age);
    }

    this.isNPC = this.charTemplate!.isNPC;
  }

  changeSubject: Subject<void> = new Subject();

  charTemplate?: CharacterTemplate;
  image: string = '';

  experience: string = '';
  description: string = '';
  notes: string = '';

  name = new FormControl('', [Validators.required]);
  height = new FormControl('', [Validators.pattern('^\\d+(\\.\\d{1,2})?$')]);
  weight = new FormControl('', [Validators.pattern('^\\d+$')]);
  age = new FormControl('', [Validators.pattern('^\\d+$')]);
  money = new FormControl('', [
    Validators.required,
    Validators.pattern('^\\d+(\\.\\d{1,2})?$'),
  ]);
  isNPC!: boolean;

  formGroup = new FormGroup({
    name: this.name,
    height: this.height,
    weight: this.weight,
    age: this.age,
    money: this.money,
  });

  allStats!: Stat[];
  statValues!: StatValue[];
  statTable: MatTableDataSource<StatValue> =
    new MatTableDataSource<StatValue>();
  statTableCols: string[] = ['name', 'value'];

  nameDebouncer = new Debouncer<void>();
  heightDebouncer = new Debouncer<void>();
  weightDebouncer = new Debouncer<void>();
  ageDebouncer = new Debouncer<void>();
  moneyDebouncer = new Debouncer<void>();
  experienceDebouncer = new Debouncer<void>();
  descriptionDebouncer = new Debouncer<void>();
  notesDebouncer = new Debouncer<void>();

  async saveName() {
    (
      await this.requestService.patch(
        this.requestService.routes.characterTemplate,
        this.charTemplate!.id,
        JSON.stringify({
          name: this.name.value,
        })
      )
    ).subscribe();
  }

  async saveHeight() {
    (
      await this.requestService.patch(
        this.requestService.routes.characterTemplate,
        this.charTemplate!.id,
        JSON.stringify({
          height: this.height.value,
          weight: this.weight.value,
          age: this.age.value,
          money: this.money.value,
          isNPC: this.isNPC,
          experience: this.experience,
          description: this.description,
          notes: this.notes,
        })
      )
    ).subscribe();
  }

  async saveWeight() {
    (
      await this.requestService.patch(
        this.requestService.routes.characterTemplate,
        this.charTemplate!.id,
        JSON.stringify({
          weight: this.weight.value,
          age: this.age.value,
          money: this.money.value,
          isNPC: this.isNPC,
          experience: this.experience,
          description: this.description,
          notes: this.notes,
        })
      )
    ).subscribe();
  }

  async saveAge() {
    (
      await this.requestService.patch(
        this.requestService.routes.characterTemplate,
        this.charTemplate!.id,
        JSON.stringify({
          age: this.age.value,
        })
      )
    ).subscribe();
  }

  async saveMoney() {
    (
      await this.requestService.patch(
        this.requestService.routes.characterTemplate,
        this.charTemplate!.id,
        JSON.stringify({
          money: this.money.value,
        })
      )
    ).subscribe();
  }

  async saveIsNpc() {
    (
      await this.requestService.patch(
        this.requestService.routes.characterTemplate,
        this.charTemplate!.id,
        JSON.stringify({
          isNPC: this.isNPC,
        })
      )
    ).subscribe();
  }

  async saveExperience() {
    (
      await this.requestService.patch(
        this.requestService.routes.characterTemplate,
        this.charTemplate!.id,
        JSON.stringify({
          experience: this.experience,
        })
      )
    ).subscribe();
  }

  async saveDescription() {
    (
      await this.requestService.patch(
        this.requestService.routes.characterTemplate,
        this.charTemplate!.id,
        JSON.stringify({
          description: this.description,
        })
      )
    ).subscribe();
  }

  async saveNotes() {
    (
      await this.requestService.patch(
        this.requestService.routes.characterTemplate,
        this.charTemplate!.id,
        JSON.stringify({
          notes: this.notes,
        })
      )
    ).subscribe();
  }

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
            this.requestService.routes.characterTemplate,
            this.charTemplate!.id,
            JSON.stringify({
              image: byteArray,
            })
          )
        ).subscribe((_) => (this.image = resultString.substring(22)));
      };

      reader.readAsDataURL(file);
    }
  }

  async create() {
    (
      await this.requestService.get(
        this.requestService.routes.characterTemplate + '/Instantiate',
        this.charTemplate!.id
      )
    ).subscribe(async (x) => {
      (
        await this.requestService.create(
          this.requestService.routes.character,
          x
        )
      ).subscribe((x: any) => {
        let snackBarRef = this.snackBar.open('Character was created!', 'Open', {
          duration: 5000,
        });

        snackBarRef.onAction().subscribe(() => {
          this.router.navigate(['legacy/char/view/' + x.id]);
        });
      });
    });
  }

  async delete() {
    this.matDialog
      .open(ConfirmationDialogComponent, {
        data: {
          message: 'Are you sure you want to delete this Character Template?',
        },
      })
      .afterClosed()
      .subscribe(async (x) => {
        if (x) {
          (
            await this.requestService.delete(
              this.requestService.routes.characterTemplate,
              this.charTemplate!.id
            )
          ).subscribe((_) => {
            this.router.navigate(['legacy/charTemplate/view']);
          });
        }
      });
  }

  patternMsg = 'has to be in format';

  getNameError() {
    return `Name can not be empty!`;
  }

  getHeightError() {
    return `Height ${this.patternMsg} \'0.00\'`;
  }

  getWeightError() {
    return `Weight ${this.patternMsg} \'00\'`;
  }

  getAgeError() {
    return `Age ${this.patternMsg} \'00\'`;
  }

  getMoneyError() {
    if (this.money.hasError('required')) {
      return `Money can not be empty!`;
    }
    return `Money ${this.patternMsg} \'0.00\'`;
  }
}
