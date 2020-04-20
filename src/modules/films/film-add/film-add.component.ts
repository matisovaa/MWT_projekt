import { Component, OnInit } from '@angular/core';
import { Film } from 'src/entities/film';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmsServerService } from 'src/services/films-server.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-film-add',
  templateUrl: './film-add.component.html',
  styleUrls: ['./film-add.component.css']
})
export class FilmAddComponent implements OnInit {
 
  filmToEdit: Film = new Film(
    "",
    0,
    undefined,
    undefined,
    '',
    {},
    [],
    []
  );

  constructor(private route: ActivatedRoute,
    private filmsServerService: FilmsServerService,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  saveFilm(film: Film) {
    this.filmsServerService.saveFilm(film).subscribe(
      () => {
        this.router.navigateByUrl("/films")
      }
    );
  }

}
