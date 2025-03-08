import { Routes } from '@angular/router';
import { AccountComponent } from './ui/core/account/account/account.component';
import { NpcListViewComponent } from './ui/views/character/list-view/npc/npc-list-view.component';
import { PlayerListViewComponent } from './ui/views/character/list-view/player/player-list-view.component';
import { CharacterViewComponent } from './ui/views/character/view/character-view.component';
import { IndexComponent } from './ui/views/index/index.component';

export const routes: Routes = [
  { path: '', component: IndexComponent, pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'account', component: AccountComponent },
  { path: 'player/list', component: PlayerListViewComponent },
  { path: 'npc/list', component: NpcListViewComponent },

  { path: 'character/:id', component: CharacterViewComponent },
];
