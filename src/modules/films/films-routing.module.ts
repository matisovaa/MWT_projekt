import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilmsMenuComponent } from './films-menu/films-menu.component';
import { FilmEditComponent } from './film-edit/film-edit.component';
import { FilmsListComponent } from './films-list/films-list.component';
import { FilmDetailComponent } from './film-detail/film-detail.component';
import { FilmAddComponent } from './film-add/film-add.component';
import { CanDeactivateGuard } from 'src/guards/can-deactivate.guard';

// hierarchicke routovanie, podla oho ako vyskladame url tak to sa zobrazi
// z deti prve co zafunguje tak to sa pouzije
const routes: Routes = [{
  path: '',//'films', dame do rodica koli asynchtonnemu routovaniu
  component: FilmsMenuComponent,
  children: [
    { path: 'edit/:id', component: FilmEditComponent, canDeactivate: [CanDeactivateGuard],},
    { path: 'add', component: FilmAddComponent },
    //toto sa zobrazi ked za films nic nedame
    {
      path: '', component: FilmsListComponent,
      children: [
        // toto sa zobrazi ak dame films/cisloID
        { path: ':id', component: FilmDetailComponent }]
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmsRoutingModule { }
