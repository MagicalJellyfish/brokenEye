import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/core/confirmation-dialog/confirmation-dialog.component';
import { WebsocketService } from 'src/app/services/api/websocket/websocket.service';
import { RequestService } from 'src/app/services/entities/request/request.service';

@Component({
  selector: 'app-char-edit',
  templateUrl: './char-edit.component.html',
  styleUrls: ['./char-edit.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false, showError: true }
    }
  ]
})

export class CharEditComponent implements OnInit {

  constructor(private requestService: RequestService, private matDialog: MatDialog, private router: Router, public dialogRef: MatDialogRef<CharEditComponent>,
    private webSocketService: WebsocketService,
    @Inject(MAT_DIALOG_DATA) public data: {
      id: number
      campaignId: number,
      name: string,
      height: number,
      weight: number,
      age: number
    },) { 
      
      this.name.setValue(data.name)
      this.height.setValue(data.height?.toString())
      this.weight.setValue(data.weight?.toString())
      this.age.setValue(data.age?.toString())
    }

  ngOnInit(): void {
  }

  name = new FormControl('', [ Validators.required ])
  height = new FormControl('', [ Validators.required, Validators.pattern("^\\d+(\\.\\d{1,2})?$") ])
  weight = new FormControl('', [ Validators.required, Validators.pattern("^\\d+$") ])
  age = new FormControl('', [ Validators.required, Validators.pattern("^\\d+$") ])

  formGroup = new FormGroup({
    name: this.name, 
    height: this.height, 
    weight: this.weight, 
    age: this.age
  })

  requiredMsg = "can not be empty!";
  patternMsg = "has to be in format";

  async save() {
    (await this.requestService.patch(this.requestService.routes.character, this.data.id, JSON.stringify({
      "name": this.name.value,
      "height": this.height.value,
      "weight": this.weight.value,
      "age": this.age.value
    }))).subscribe()
  }

  deleteChar() {
    this.matDialog.open(ConfirmationDialogComponent, { data: { message: "Are you sure you want to delete this character?" }}).afterClosed().subscribe(async x =>
      {
        if(x) {
          (await this.requestService.delete(this.requestService.routes.character, this.data.id)).subscribe(_ => {
            this.router.navigate(["char/view"])
            this.webSocketService.closeConnection()
            this.dialogRef.close()
          })
        }
      }
    )
  }

  getNameError() {
    return `Name ${this.requiredMsg}`
  }

  getHeightError() {
    if(this.height.hasError("required")) {
      return `Height ${this.requiredMsg}`
    }
    return `Height ${this.patternMsg} \'0.00\'`
  }

  getWeightError() {
    if(this.weight.hasError("required")) {
      return `Weight ${this.requiredMsg}`
    }
    return `Weight ${this.patternMsg} \'00\'`
  }

  getAgeError() {
    if(this.age.hasError("required")) {
      return `Age ${this.requiredMsg}`
    }
    return `Age ${this.patternMsg} \'00\'`
  }
}
