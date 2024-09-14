//Base imports
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

//Material imports
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';

//Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopbarComponent } from './core/topbar/topbar.component';
import { SettingsDialogComponent } from './core/settings-dialog/settings-dialog.component';
import { CharViewComponent } from './entities/character/view/char-view/char-view.component';
import { HpCardComponent } from './entities/character/view/char-view/cards/hp-card/hp-card.component';
import { MiscCharCardComponent } from './entities/character/view/char-view/cards/misc-char-card/misc-char-card.component';
import { StatsCardComponent } from './entities/character/view/char-view/cards/stats-card/stats-card.component';
import { MiscInfoCardComponent } from './entities/character/view/char-view/cards/misc-info-card/misc-info-card.component';
import { LargeCardComponent } from './entities/character/view/char-view/cards/large-card/large-card.component';
import { CharEditComponent } from './entities/character/edit/char-edit/char-edit.component';
import { IndexComponent } from './core/index/index.component';
import { CharCreateComponent } from './entities/character/create/char-create/char-create.component';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './core/account/account/account.component';
import { AuthenticationInterceptor } from './services/response-interceptor/authentication.interceptor';
import { ConfirmationDialogComponent } from './core/confirmation-dialog/confirmation-dialog.component';
import { StatsEditComponent } from './entities/stat/stats-edit/stats-edit.component';
import { TemplatesViewComponent } from './entities/templates/templates-view/templates-view.component';
import { TemplateEditComponent } from './entities/templates/template-edit/template-edit.component';
import { TemplateViewComponent } from './entities/templates/template-view/template-view.component';
import { TemplateSelectComponent } from './entities/templates/template-select/template-select.component';
import { ElementOrderComponent } from './entities/elements/element-order/element-order.component';
import { ElementEditComponent } from './entities/elements/element-edit/element-edit.component';
import { ElementViewComponent } from './entities/elements/element-view/element-view.component';
import { TemplateDialogTabSingleComponent } from './entities/templates/template-dialog-tab/template-dialog-tab-single/template-dialog-tab-single.component';
import { TemplateDialogTabMultipleComponent } from './entities/templates/template-dialog-tab/template-dialog-tab-multiple/template-dialog-tab-multiple.component';
import { StatDialogTabComponent } from './entities/stat/stat-dialog-tab/stat-dialog-tab.component';
import { ElementDialogTabSingleComponent } from './entities/elements/element-dialog-tab/element-dialog-tab-single/element-dialog-tab-single.component';
import { ElementDialogTabMultipleComponent } from './entities/elements/element-dialog-tab/element-dialog-tab-multiple/element-dialog-tab-multiple.component';
import { ElementTabComponent } from './entities/elements/element-tab/element-tab.component';
import { ElementNestedTabComponent } from './entities/elements/element-nested-tab/element-nested-tab.component';
import { DiscordUidEditComponent } from './core/discord-uid-edit/discord-uid-edit.component';
import { CharTemplateViewComponent } from './entities/characterTemplate/char-template-view/char-template-view.component';
import { CharTemplateListComponent } from './entities/characterTemplate/char-template-list/char-template-list.component';
import { UserCharListComponent } from './entities/character/list/user-char-list/user-char-list.component';
import { NpcCharListComponent } from './entities/character/list/npc-char-list/npc-char-list.component';
import { CharTemplateCreateComponent } from './entities/characterTemplate/char-template-create/char-template-create.component';
import { TemplateTabComponent } from './entities/templates/template-tab/template-tab.component';
import { TemplateNestedTabComponent } from './entities/templates/template-nested-tab/template-nested-tab.component';
import { TemplatesViewTabComponent } from './entities/templates/templates-view/templates-view-tab/templates-view-tab.component';
import { RollsEditComponent } from './entities/roll/rolls-edit/rolls-edit.component';
import { RollDialogTabComponent } from './entities/roll/roll-dialog-tab/roll-dialog-tab.component';
import { ApiUrlService } from './services/api/apiUrl/api-url.service';
import { SignalrService } from './services/signalr/signalr.service';
import { UserService } from './services/user/user.service';

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    SettingsDialogComponent,
    CharViewComponent,
    HpCardComponent,
    MiscCharCardComponent,
    StatsCardComponent,
    MiscInfoCardComponent,
    LargeCardComponent,
    CharEditComponent,
    IndexComponent,
    CharCreateComponent,
    AccountComponent,
    ConfirmationDialogComponent,
    StatsEditComponent,
    TemplatesViewComponent,
    TemplateEditComponent,
    TemplateViewComponent,
    TemplateSelectComponent,
    ElementOrderComponent,
    ElementEditComponent,
    ElementViewComponent,
    TemplateDialogTabSingleComponent,
    TemplateDialogTabMultipleComponent,
    StatDialogTabComponent,
    ElementDialogTabSingleComponent,
    ElementDialogTabMultipleComponent,
    ElementTabComponent,
    ElementNestedTabComponent,
    DiscordUidEditComponent,
    CharTemplateViewComponent,
    CharTemplateListComponent,
    UserCharListComponent,
    NpcCharListComponent,
    CharTemplateCreateComponent,
    TemplateTabComponent,
    TemplateNestedTabComponent,
    TemplatesViewTabComponent,
    RollsEditComponent,
    RollDialogTabComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSidenavModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatCardModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTabsModule,
    MatMenuModule,
    MatStepperModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    DragDropModule,
    MatSelectModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ApiUrlService, UserService],
      useFactory:
        (apiUrlService: ApiUrlService, userService: UserService) =>
        async () => {
          await apiUrlService.loadUrl();
          await userService.InitUser();
        },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
      deps: [MatSnackBar, UserService, ApiUrlService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
