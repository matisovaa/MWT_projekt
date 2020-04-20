import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { UsersListComponent } from './users-list/users-list.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
//import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from 'src/guards/auth.guard';
import { SelectingPreloadingStrategyService } from 'src/guards/selecting-preloading-strategy.service';
//import { EditUserComponent } from './edit-user/edit-user.component';

/* zakomentovane sme presunuli do modulu */
const routes: Routes = [
  //{ path: 'users/edit/:id', component: EditUserComponent },
  //{ path: 'users', component: UsersListComponent },
  //{ path: 'extended-users', component: ExtendedUsersComponent },  
  {// asynchronne sa natiahne modul films
    path: 'films', loadChildren: () =>
      import('../modules/films/films.module')
        .then(mod => mod.FilmsModule),
    canLoad: [AuthGuard], 
    // natiahne sa az ked pojdeme na films
    data: { preloading: false }
  },
  {
    path: 'users',
    loadChildren: () =>
      import('../modules/users/users.module')
        .then(mod => mod.UsersModule),
    canLoad: [AuthGuard],
    // natahuje sa na pozadi ak je login alebo register stranka
    data: { preloading: true }
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent } // ako posledne odchytava vsetko
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes,
      { preloadingStrategy: SelectingPreloadingStrategyService })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
