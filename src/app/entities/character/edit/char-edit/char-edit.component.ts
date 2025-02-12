import { CdkScrollable } from '@angular/cdk/scrolling';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { ConfirmationDialogComponent } from 'src/app/ui/parts/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-char-edit',
  templateUrl: './char-edit.component.html',
  styleUrls: ['./char-edit.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false, showError: true },
    },
  ],
  imports: [
    CdkScrollable,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatError,
    MatCheckbox,
    MatSuffix,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class CharEditComponent implements OnInit {
  constructor(
    private requestService: RequestService,
    private matDialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<CharEditComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: number;
      campaignId: number;
      name: string;
      height: number;
      weight: number;
      age: number;
      defaultShortcut: string;
      isNPC: boolean;
    }
  ) {
    this.name.setValue(data.name);
    this.height.setValue(data.height?.toString());
    this.weight.setValue(data.weight?.toString());
    this.age.setValue(data.age?.toString());
    this.defaultShortcut.setValue(data.defaultShortcut?.toString());
    this.isNPC = data.isNPC;
  }

  ngOnInit(): void {}

  name = new FormControl('', [Validators.required]);
  height = new FormControl('', [Validators.pattern('^\\d+(\\.\\d{1,2})?$')]);
  weight = new FormControl('', [Validators.pattern('^\\d+$')]);
  age = new FormControl('', [Validators.pattern('^\\d+$')]);
  defaultShortcut = new FormControl('');
  isNPC!: boolean;

  formGroup = new FormGroup({
    name: this.name,
    height: this.height,
    weight: this.weight,
    age: this.age,
    defaultShortcut: this.defaultShortcut,
  });

  requiredMsg = 'can not be empty!';
  patternMsg = 'has to be in format';

  async save() {
    (
      await this.requestService.patch(
        this.requestService.routes.character,
        this.data.id,
        JSON.stringify({
          name: this.name.value,
          height: this.height.value,
          weight: this.weight.value,
          age: this.age.value,
          defaultShortcut: this.defaultShortcut.value,
          isNPC: this.isNPC,
        })
      )
    ).subscribe();
  }

  deleteChar() {
    this.matDialog
      .open(ConfirmationDialogComponent, {
        data: { message: 'Are you sure you want to delete this character?' },
      })
      .afterClosed()
      .subscribe(async (x) => {
        if (x) {
          (
            await this.requestService.delete(
              this.requestService.routes.character,
              this.data.id
            )
          ).subscribe((_) => {
            this.router.navigate(['char/view']);
            this.dialogRef.close();
          });
        }
      });
  }

  getNameError() {
    return `Name ${this.requiredMsg}`;
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
}
