import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DiscordUidEditApiService } from './discord-uid-edit.api-service';

@Component({
  selector: 'app-discord-uid-edit',
  templateUrl: './discord-uid-edit.dialog.html',
  styleUrls: ['./discord-uid-edit.dialog.scss'],
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
export class DiscordUidEditDialog implements OnInit {
  constructor(
    private apiService: DiscordUidEditApiService,
    private dialogRef: MatDialogRef<DiscordUidEditDialog>,
  ) {}

  async ngOnInit() {
    this.apiService.getDiscordUid().subscribe((x) => {
      this.discordId = x.discordId;
    });
  }

  discordId: string | undefined;

  async save() {
    this.apiService
      .updateDiscordUid(this.discordId!)
      .subscribe((_) => this.dialogRef.close());
  }
}
