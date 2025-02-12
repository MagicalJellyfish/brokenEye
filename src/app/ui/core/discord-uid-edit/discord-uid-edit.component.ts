import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-discord-uid-edit',
  templateUrl: './discord-uid-edit.component.html',
  styleUrls: ['./discord-uid-edit.component.scss'],
  imports: [
    CdkScrollable,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class DiscordUidEditComponent implements OnInit {
  constructor(
    private requestService: RequestService,
    private dialogRef: MatDialogRef<DiscordUidEditComponent>
  ) {}

  async ngOnInit() {
    (await this.requestService.getAll('Auth/discord')).subscribe(
      (x: any) => (this.discordId = x.discordId)
    );
  }

  discordId: string | undefined;

  async save() {
    (
      await this.requestService.fullPatch('Auth/discord', this.discordId!, null)
    ).subscribe();
    this.dialogRef.close();
  }
}
