import { Component, EventEmitter, Input, Output, OnChanges, OnInit } from '@angular/core';
import { Film } from 'src/entities/film';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { FilmsServerService } from 'src/services/films-server.service';
import { Router } from '@angular/router';
import { Clovek } from 'src/entities/clovek';
import { Postava } from 'src/entities/postava';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/modules/users/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-film-edit-child',
  templateUrl: './film-edit-child.component.html',
  styleUrls: ['./film-edit-child.component.css']
})
export class FilmEditChildComponent implements OnChanges {

  @Input() film: Film;
  @Output() changed = new EventEmitter<Film>();

  reziser: Clovek[];
  postava: Postava[];

  // model nasho formulara zodpovedny za validaciu
  filmEditForm = new FormGroup(
    {
      nazov: new FormControl('',
        [Validators.required]
      ),
      rok: new FormControl(0, [
        Validators.required,
      ]),
      slovenskyNazov: new FormControl(''),
      afi1998: new FormControl(''),
      afi2007: new FormControl(''),

      reziser: new FormArray([]),
      reziser_new_nazovPostavy: new FormControl(''),
      reziser_new_krstneMeno: new FormControl(''),
      reziser_new_stredneMeno: new FormControl(''),
      reziser_new_priezvisko: new FormControl(''),

      postava: new FormArray([]),
      postava_new_nazovPostavy: new FormControl(''),
      dolezitost_new_nazovPostavy: new FormControl('hlavna'),
      postava_new_krstneMeno: new FormControl(''),
      postava_new_stredneMeno: new FormControl(''),
      postava_new_priezvisko: new FormControl('')

    });

  constructor(private filmsServerService: FilmsServerService,
    private router: Router, private dialog: MatDialog) { }

  // toto sa zavola ked sa zmeni @input
  ngOnChanges(): void {
    if (this.film) {
      this.nazov.setValue(this.film.nazov);
      this.rok.setValue(this.film.rok);

      this.slovenskyNazov.setValue(this.film.slovenskyNazov);

      this.afi1998.setValue(this.film.poradieVRebricku["AFI 1998"])
      this.afi2007.setValue(this.film.poradieVRebricku["AFI 2007"])
      this.film.reziser.forEach(jedenReziser => {
        this.reziseri.push(new FormGroup(
          {
            priezvisko: new FormControl(jedenReziser.priezvisko),
            krstneMeno: new FormControl(jedenReziser.krstneMeno),
            stredneMeno: new FormControl(jedenReziser.stredneMeno)
          })
        )
      })
      this.film.postava.forEach(jednaPostava => {
        let dolezitost_postavy = '' //'hlavná postava' | 'vedľajšia postava'
        if (jednaPostava.dolezitost === 'hlavná postava') {
          dolezitost_postavy = 'hlavna'
        } else {
          dolezitost_postavy = 'vedlajsia'
        }

        this.postavy.push(new FormGroup(
          {
            nazovPostavy: new FormControl(jednaPostava.postava),
            dolezitost: new FormControl(dolezitost_postavy),
            priezvisko: new FormControl(jednaPostava.herec.priezvisko),
            krstneMeno: new FormControl(jednaPostava.herec.krstneMeno),
            stredneMeno: new FormControl(jednaPostava.herec.stredneMeno)
          })
        )
      })
    }
  }

  // aby sme s premennou mohli pracovat v sablone (.html)
  get nazov() {
    return this.filmEditForm.get('nazov') as FormControl;
  }

  get rok() {
    return this.filmEditForm.get('rok') as FormControl;
  }

  get slovenskyNazov() {
    return this.filmEditForm.get('slovenskyNazov') as FormControl;
  }

  get afi1998() {
    return this.filmEditForm.get('afi1998') as FormControl;
  }
  get afi2007() {
    return this.filmEditForm.get('afi2007') as FormControl;
  }

  get reziseri() {
    return this.filmEditForm.get('reziser') as FormArray;
  }

  get reziser_new_krstneMeno() {
    return this.filmEditForm.get('reziser_new_krstneMeno') as FormControl;
  }
  get reziser_new_stredneMeno() {
    return this.filmEditForm.get('reziser_new_stredneMeno') as FormControl;
  }
  get reziser_new_priezvisko() {
    return this.filmEditForm.get('reziser_new_priezvisko') as FormControl;
  }

  get postavy() {
    return this.filmEditForm.get('postava') as FormArray;
  }

  get postava_new_nazovPostavy() {
    return this.filmEditForm.get('postava_new_nazovPostavy') as FormControl;
  }
  get dolezitost_new_nazovPostavy() {
    return this.filmEditForm.get('dolezitost_new_nazovPostavy') as FormControl;
  }

  get postava_new_krstneMeno() {
    return this.filmEditForm.get('postava_new_krstneMeno') as FormControl;
  }
  get postava_new_stredneMeno() {
    return this.filmEditForm.get('postava_new_stredneMeno') as FormControl;
  }
  get postava_new_priezvisko() {
    return this.filmEditForm.get('postava_new_priezvisko') as FormControl;
  }

  deleteReziser(i: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Deleting reziser",
        message: "Naozaj chcete vymazať vybraného rezisera?"
      }
    });
    // podla vysledku z dialogu bud mazeme alebo nie
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reziseri.removeAt(i);
      }
    });
  }

  pridatRezisera() {
    this.reziseri.push(new FormGroup(
      {
        priezvisko: new FormControl(this.reziser_new_priezvisko.value),
        krstneMeno: new FormControl(this.reziser_new_krstneMeno.value),
        stredneMeno: new FormControl(this.reziser_new_stredneMeno.value)
      })
    )
    this.reziser_new_priezvisko.setValue('')
    this.reziser_new_krstneMeno.setValue('')
    this.reziser_new_stredneMeno.setValue('')
  }

  deletePostava(i: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Deleting postava",
        message: "Naozaj chcete vymazať vybranú postavu?"
      }
    });
    // podla vysledku z dialogu bud mazeme alebo nie
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.postavy.removeAt(i);
      }
    });
  }

  pridatPostavu() {
    this.postavy.push(new FormGroup(
      {
        nazovPostavy: new FormControl(this.postava_new_nazovPostavy.value),
        dolezitost: new FormControl(this.dolezitost_new_nazovPostavy.value),
        priezvisko: new FormControl(this.postava_new_priezvisko.value),
        krstneMeno: new FormControl(this.postava_new_krstneMeno.value),
        stredneMeno: new FormControl(this.postava_new_stredneMeno.value)
      })
    )
    this.postava_new_nazovPostavy.setValue('')
    this.postava_new_priezvisko.setValue('')
    this.postava_new_krstneMeno.setValue('')
    this.postava_new_stredneMeno.setValue('')
  }

  formSubmit() {
    let poradieVRebricku = {}
    if (this.afi1998) {
      poradieVRebricku = { ...poradieVRebricku, "AFI 1998": this.afi1998.value };
    }
    if (this.afi2007) {
      poradieVRebricku = { ...poradieVRebricku, "AFI 2007": this.afi2007.value };
    }

    let reziseriNaUlozenie: Clovek[] = [];
    this.reziseri.controls.forEach((jedenReziser: FormGroup) => {
      reziseriNaUlozenie.push(new Clovek(
        jedenReziser.value.priezvisko,
        (jedenReziser.value.krstneMeno || ''),
        (jedenReziser.value.stredneMeno || ''),
        1 // id aby nebolo null
      )
      )
    })

    let postavyNaUlozenie: Postava[] = [];
    this.postavy.controls.forEach((jednaPostava: FormGroup) => {
      let dolezitost_postavy: 'hlavná postava' | 'vedľajšia postava' //'hlavná postava' | 'vedľajšia postava'
      if (jednaPostava.value.dolezitost === 'hlavna') {
        dolezitost_postavy = 'hlavná postava'
      } else {
        dolezitost_postavy = 'vedľajšia postava'
      }

      postavyNaUlozenie.push(new Postava(
        jednaPostava.value.nazovPostavy,
        dolezitost_postavy, //'hlavná postava'| 'vedľajšia postava'
        new Clovek(
          jednaPostava.value.priezvisko,
          (jednaPostava.value.krstneMeno || ''),
          (jednaPostava.value.stredneMeno || ''),
          1 // id aby nebolo null
        )
      ))
    })

    const newFilm = new Film(
      this.nazov.value,
      this.rok.value,
      this.film.id,
      this.film.imdbID,
      this.slovenskyNazov.value,
      poradieVRebricku,
      reziseriNaUlozenie,
      postavyNaUlozenie

    );

    // poslanie rodicovy ako vystupny parameter
    this.changed.next(newFilm);
  }

}
