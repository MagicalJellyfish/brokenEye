import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharViewComponent } from './entities/character/view/char-view/char-view.component';
import { CharEditComponent } from './entities/character/edit/char-edit/char-edit.component';
import { IndexComponent } from './core/index/index.component';
import { CharCreateComponent } from './entities/character/create/char-create/char-create.component';
import { AccountComponent } from './core/account/account/account.component';
import { UserCharViewComponent } from './entities/character/view/user-char-view/user-char-view.component';
import { TemplatesViewComponent } from './entities/templates/templates-view/templates-view.component';

const routes: Routes = [
  { path: '', component: IndexComponent, pathMatch: 'full'},
  { path: 'index', component: IndexComponent},
  { path: 'account', component: AccountComponent},
  { path: 'char/view', component: UserCharViewComponent },
  { path: 'char/view/:id', component: CharViewComponent },
  { path: 'char/create', component: CharCreateComponent },
  { path: 'templates', component: TemplatesViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
