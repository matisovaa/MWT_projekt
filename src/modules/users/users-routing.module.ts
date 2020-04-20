import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UsersListComponent } from './users-list/users-list.component';
import { AuthGuard } from 'src/guards/auth.guard';
import { CanDeactivateGuard } from 'src/guards/can-deactivate.guard';
import { UserResolverService } from 'src/guards/user-resolver.service';
import { AddUserComponent } from './add-user/add-user.component';


const routes: Routes = [
  // sme dali prec zo zaciatku users, lebo to dame do rodica
  // 'users/edit/:id'
  // 'users/add'
  // 'extended-users'
  {
    path: 'edit/:id', component: EditUserComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    resolve: {
      user: UserResolverService
    }
  },
  { path: "add", component: AddUserComponent, canActivate: [AuthGuard] },
  {
    path: 'extended',
    component: ExtendedUsersComponent,
    canActivate: [AuthGuard]
  }, // Aby sme pouzili guard
  { path: 'simple', component: UsersListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
