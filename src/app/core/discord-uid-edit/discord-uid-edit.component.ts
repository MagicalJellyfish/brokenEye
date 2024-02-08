import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RequestService } from 'src/app/services/entities/request/request.service';

@Component({
  selector: 'app-discord-uid-edit',
  templateUrl: './discord-uid-edit.component.html',
  styleUrls: ['./discord-uid-edit.component.scss']
})
export class DiscordUidEditComponent implements OnInit {
  constructor(private requestService: RequestService, private dialogRef: MatDialogRef<DiscordUidEditComponent>) { }

  async ngOnInit() {
    (await this.requestService.getAll("Auth/discord")).subscribe((x: any) => this.discordId = x.discordId)
  }

  discordId: string | undefined;

  async save() {
    (await this.requestService.fullPatch("Auth/discord", this.discordId!, null)).subscribe()
    this.dialogRef.close()
  }
}
