// subor s importami Materialov

import { NgModule } from '@angular/core';

import { MatTableModule } from '@angular/material/table'; // https://material.angular.io/components/table/api
import { MatCardModule } from '@angular/material/card'; // https://material.angular.io/components/card/api
import { MatButtonModule } from '@angular/material/button'; // https://material.angular.io/components/button/api
import { MatInputModule } from '@angular/material/input'; // https://material.angular.io/components/input/api
import {MatIconModule} from '@angular/material/icon'; // https://material.angular.io/components/icon/api, https://material.io/resources/icons/?style=baseline
// dinamicky generovany komponent nie je pevne v html, vytvori sa cez servis
import {MatSnackBarModule} from '@angular/material/snack-bar'; // https://material.angular.io/components/snack-bar/api
import {MatToolbarModule} from '@angular/material/toolbar'; // https://material.angular.io/components/toolbar/api
// https://material.io/resources/icons/?style=baseline
import {MatPaginatorModule} from '@angular/material/paginator'; // https://material.angular.io/components/paginator/api
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog'; // https://material.angular.io/components/dialog/api
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; //https://material.angular.io/components/slide-toggle/api
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [],
  imports: [
    MatTableModule, // sme pridali sem aj ked sme hore napisali import
    MatCardModule, // prihlasovaci formular
    MatButtonModule, // tlacidlo
    MatInputModule, // textove pole
    MatIconModule,
    MatSnackBarModule, // sa na chvilu zobrazi okienko s textom a samo zmizne
    MatToolbarModule,
    MatPaginatorModule, // kolko riadkov tab sa ma naraz zobrazovat
    MatSortModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  exports: [
    MatTableModule, // sme pridali sem aj ked sme hore napisali import
    MatCardModule, // prihlasovaci formular
    MatButtonModule, // tlacidlo
    MatInputModule, // textove pole
    MatIconModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class MaterialModule { }
