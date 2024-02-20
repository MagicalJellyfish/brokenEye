  import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterTemplate } from 'src/app/api-classes/Characters/CharacterTemplate';
import { ConfirmationDialogComponent } from 'src/app/core/confirmation-dialog/confirmation-dialog.component';
import { RequestService } from 'src/app/services/entities/request/request.service';

@Component({
  selector: 'app-char-template-view',
  templateUrl: './char-template-view.component.html',
  styleUrls: ['./char-template-view.component.scss']
})
export class CharTemplateViewComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, protected requestService: RequestService, private matDialog: MatDialog, private snackBar: MatSnackBar) { }

  async ngOnInit(): Promise<void> {
    (await this.requestService.get(this.requestService.routes.characterTemplate, +this.route.snapshot.paramMap.get('id')!)).subscribe((x: any) => {
      this.charTemplate = x

      var charCodeString: string = ""
      for(var i = 0; i < this.charTemplate!.image.length; i++) {
        charCodeString += String.fromCharCode(this.charTemplate!.image[i])
      }
      this.image = btoa(charCodeString)

      this.name.setValue(this.charTemplate!.name)
      this.money.setValue(this.charTemplate!.money.toString())

      let height = null
      if(this.charTemplate!.height != undefined)
        height = this.charTemplate!.height.toString();

      let weight = null
      if(this.charTemplate!.weight != undefined)
        weight = this.charTemplate!.weight.toString();
      
      let age = null
      if(this.charTemplate!.age != undefined)
        age = this.charTemplate!.age.toString();

      this.height.setValue(height)
      this.weight.setValue(weight)
      this.age.setValue(age)
    })
  }

  charTemplate?: CharacterTemplate;
  image: string = ""

  name = new FormControl('', [ Validators.required ])
  height = new FormControl('', [ Validators.pattern("^\\d+(\\.\\d{1,2})?$") ])
  weight = new FormControl('', [ Validators.pattern("^\\d+$") ])
  age = new FormControl('', [ Validators.pattern("^\\d+$") ])
  money = new FormControl('', [ Validators.required, Validators.pattern("^\\d+(\\.\\d{1,2})?$") ])
  isNPC!: boolean;

  formGroup = new FormGroup({
    name: this.name, 
    height: this.height, 
    weight: this.weight, 
    age: this.age,
    money: this.money
  })

  patternMsg = "has to be in format";

  async save() {
    (await this.requestService.patch(this.requestService.routes.characterTemplate, this.charTemplate!.id, JSON.stringify({
      "name": this.name.value,
      "height": this.height.value,
      "weight": this.weight.value,
      "age": this.age.value,
      "money": this.money.value,
      "isNPC": this.isNPC
    }))).subscribe(_ => this.snackBar.open("Saved changes!", "OK", { duration: 2000 }))
  }

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

        (await this.requestService.patch(this.requestService.routes.characterTemplate, this.charTemplate!.id, JSON.stringify({
          "image": byteArray
        }))).subscribe(_ => this.image = resultString.substring(22))
      };

      reader.readAsDataURL(file);
    }
  }

  async create() {
    (await this.requestService.get(this.requestService.routes.characterTemplate + "/Instantiate", this.charTemplate!.id)).subscribe(async x => {
      (await this.requestService.create(this.requestService.routes.character, x)).subscribe((x: any) => {
        let snackBarRef = this.snackBar.open("Character was created!", "Open", { duration: 5000 });

        snackBarRef.onAction().subscribe(() => {
          this.router.navigate(["char/view/" + x.id])
        });
      })
    })
  }

  async delete() {
    this.matDialog.open(ConfirmationDialogComponent, { data: { message: "Are you sure you want to delete this Character Template?" }}).afterClosed().subscribe(async x =>
      {
        if(x) {
          (await this.requestService.delete(this.requestService.routes.characterTemplate, this.charTemplate!.id)).subscribe(_ => {
            this.router.navigate(["charTemplate/view"])
          })
        }
      }
    )
  }

  getNameError() {
    return `Name can not be empty!`
  }

  getHeightError() {
    return `Height ${this.patternMsg} \'0.00\'`
  }

  getWeightError() {
    return `Weight ${this.patternMsg} \'00\'`
  }

  getAgeError() {
    return `Age ${this.patternMsg} \'00\'`
  }

  getMoneyError() {
    if(this.money.hasError("required")) {
      return `Money can not be empty!`
    }
    return `Money ${this.patternMsg} \'0.00\'`
  }
}
