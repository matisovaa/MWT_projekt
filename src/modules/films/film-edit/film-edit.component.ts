import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { Film } from 'src/entities/film';
import { FilmsServerService } from 'src/services/films-server.service';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from 'src/modules/users/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-film-edit',
  templateUrl: './film-edit.component.html',
  styleUrls: ['./film-edit.component.css']
})
export class FilmEditComponent implements OnInit {

  filmToEdit: Film;
  filmSaved = false;

  constructor(private route: ActivatedRoute, 
    private filmsServerService: FilmsServerService,
    private router: Router, 
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      // switchMap prerusi volanie na server ak uz chceme daco ine a pyta od servera nove
      switchMap((params: ParamMap) =>
        // z url aderesi sme si zobrali id
        // vrati film z danym id
        this.filmsServerService.getFilm(+params.get("id")) // to + je pretipovanie stringu na number
      )
    ).subscribe((film: Film) => {
      this.filmSaved = false;
      this.filmToEdit = film
    })
  }

  saveFilm(film: Film) {
    this.filmsServerService.saveFilm(film).subscribe(
      () => {
        this.router.navigateByUrl("/films")
        this.filmSaved = true; // koli guardovi
      }
    );

  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.filmSaved) {
      return true;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Leaving?",
        message: "Edited film is not saved, leave?"
      }
    });
    return dialogRef.afterClosed().pipe(map((result) => !!result));
  }

}
