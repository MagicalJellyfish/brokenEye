import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharViewComponent } from './entities/character/view/char-view/char-view.component';
import { IndexComponent } from './core/index/index.component';
import { CharCreateComponent } from './entities/character/create/char-create/char-create.component';
import { AccountComponent } from './core/account/account/account.component';
import { TemplatesViewComponent } from './entities/templates/templates-view/templates-view.component';
import { CharTemplateListComponent } from './entities/characterTemplate/char-template-list/char-template-list.component';
import { CharTemplateViewComponent } from './entities/characterTemplate/char-template-view/char-template-view.component';
import { UserCharListComponent } from './entities/character/list/user-char-list/user-char-list.component';
import { NpcCharListComponent } from './entities/character/list/npc-char-list/npc-char-list.component';
import { CharTemplateCreateComponent } from './entities/characterTemplate/char-template-create/char-template-create.component';

const routes: Routes = [
  { path: '', component: IndexComponent, pathMatch: 'full'},
  { path: 'index', component: IndexComponent},
  { path: 'account', component: AccountComponent},
  { path: 'char/view', component: UserCharListComponent },
  { path: 'char/npc/view', component: NpcCharListComponent },
  { path: 'char/view/:id', component: CharViewComponent },
  { path: 'char/create', component: CharCreateComponent },
  { path: 'templates', component: TemplatesViewComponent },
  { path: 'charTemplate/view', component: CharTemplateListComponent },
  { path: 'charTemplate/view/:id', component: CharTemplateViewComponent },
  { path: 'charTemplate/create', component: CharTemplateCreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
