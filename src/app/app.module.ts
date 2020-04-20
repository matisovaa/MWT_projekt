import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // sme pridali aby sme mohli robit requests
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin'
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin'
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';


import { AppComponent } from './app.component';
//import { UsersListComponent } from './users-list/users-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MaterialModule } from './material.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
//import { ExtendedUsersComponent } from './extended-users/extended-users.component';
//import { GroupsToStringPipe } from '../pipes/groups-to-string.pipe';
import { RegisterComponent } from './register/register.component';
import { UsersModule } from 'src/modules/users/users.module';
import { FilmsModule } from 'src/modules/films/films.module';
import { AuthState } from 'src/shared/auth.state';
import { environment } from 'src/environments/environment';
//import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
//import { EditUserComponent } from './edit-user/edit-user.component';
//import { UserEditChildComponent } from './user-edit-child/user-edit-child.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    NavBarComponent,
    //GroupsToStringPipe,
    RegisterComponent,
    //UsersListComponent,
    //ExtendedUsersComponent,
    //ConfirmDialogComponent,
    //EditUserComponent,
    //UserEditChildComponent
  ],
  imports: [
    NgxsModule.forRoot([AuthState/*pole stavovych tried*/], {
      developmentMode: !environment.production,
      selectorOptions: {
        suppressErrors: false,
        injectContainerState: false
      }
    }),// je zvykom aby to bola prva importovna vec
    NgxsStoragePluginModule.forRoot({
      key: ["auth.token", "auth.username"] // uvedieme nazvy zo stavovej triedy toho co chceme ukladat
    }),
    // nasledujuce dva moduly treba mat vzdy posledne z Ngxs modulov
    // zobrazuje hodnotu stavu a da sa pridat do chromu   
    NgxsReduxDevtoolsPluginModule.forRoot(),
    // aby logovalo o ulozisku do konzoly, treba to dat ako posledne z Ngxs modulov
    NgxsLoggerPluginModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,  // sme pridali aby sme mohli robit requests
    FormsModule,    // na formulare   
    ReactiveFormsModule,
    MaterialModule,
    UsersModule, // pridanie nasho noveho vyrobeneho modulu
    // FilmsModule, davame ho stade prec, lebo to ideme urobit asynchronne
    AppRoutingModule  // je zvykom to mat posledne       
  ],
  providers: [],
  //entryComponents:[ConfirmDialogComponent], // aby sa dinamicky vedel pridat dialog
  bootstrap: [AppComponent]
})
export class AppModule { }
