import { Routes } from '@angular/router';
import { CharCreateComponent } from './entities/character/create/char-create/char-create.component';
import { NpcCharListComponent } from './entities/character/list/npc-char-list/npc-char-list.component';
import { UserCharListComponent } from './entities/character/list/user-char-list/user-char-list.component';
import { CharViewComponent } from './entities/character/view/char-view/char-view.component';
import { CharTemplateCreateComponent } from './entities/characterTemplate/char-template-create/char-template-create.component';
import { CharTemplateListComponent } from './entities/characterTemplate/char-template-list/char-template-list.component';
import { CharTemplateViewComponent } from './entities/characterTemplate/char-template-view/char-template-view.component';
import { TemplatesViewComponent } from './entities/templates/templates-view/templates-view.component';
import { AccountComponent } from './ui/core/account/account/account.component';
import { IndexComponent } from './ui/views/index/index.component';

export const routes: Routes = [
  { path: '', component: IndexComponent, pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'account', component: AccountComponent },

  { path: 'legacy/char/npc/view', component: NpcCharListComponent },
  { path: 'legacy/char/view/:id', component: CharViewComponent },
  { path: 'legacy/char/create', component: CharCreateComponent },
  { path: 'legacy/templates', component: TemplatesViewComponent },
  { path: 'legacy/charTemplate/view', component: CharTemplateListComponent },
  {
    path: 'legacy/charTemplate/view/:id',
    component: CharTemplateViewComponent,
  },
  {
    path: 'legacy/charTemplate/create',
    component: CharTemplateCreateComponent,
  },
];
