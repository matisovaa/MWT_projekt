import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter } from '@angular/core';
import { FilmsServerService } from 'src/services/films-server.service';
import { Film } from 'src/entities/film';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DataSource } from '@angular/cdk/table';
import { Observable, of } from 'rxjs';
import { map, switchMap, mergeAll, tap } from 'rxjs/operators';
import { MatSort, Sort } from '@angular/material/sort';


@Component({
  selector: 'app-films-list',
  templateUrl: './films-list.component.html',
  styleUrls: ['./films-list.component.css']
})
export class FilmsListComponent implements OnInit, AfterViewInit {

  dataSource: FilmsDataSource;
  // premenna, ktora ma v sebe Observable ma v nazve $
  filter$ = new EventEmitter<string>();

  // uz nebudeme pouzivat tuto premennu ako zdroj dat
  // films: Film[] = [];
  columnsToDisplay = ['id', 'nazov', 'slovenskyNazov', 'rok'
    , 'afi1998', 'afi2007','actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private filmsServerService: FilmsServerService) { }

  ngOnInit(): void {
    if (!this.filmsServerService.token) {
      this.columnsToDisplay = ['id', 'nazov', 'rok'];
    }
    // tu uz treba vediet data co sa budu vykreslovat v tabulke
    this.dataSource = new FilmsDataSource(this.filmsServerService);
  }

  ngAfterViewInit(): void {
    this.dataSource.setObservables(
      this.paginator,
      this.filter$,
      this.sort
    );

    // toto realizujeme priamo v nasej implementacii dataSource
    //this.filmsServerService.getFilms().subscribe(
    //  filmsResponse => this.films = filmsResponse.items
    //);
  }

  applyFilter(value: string) {
    this.filter$.next(value);
  }
}

class FilmsDataSource implements DataSource<Film>{

  paginator: MatPaginator;
  futureObservables = new EventEmitter<Observable<any>>();
  pageSize: number;
  indexFrom: number;
  filter: string;
  orderBy: string;
  descending: boolean;

  constructor(private filmsServerService: FilmsServerService) { }

  setObservables(paginator: MatPaginator,
    filter$: Observable<string>,
    sort: MatSort
  ) {
    this.paginator = paginator;

    // aby nebola tabulka na zaciatku prazna
    this.pageSize = paginator.pageSize;
    this.indexFrom = paginator.pageIndex * paginator.pageSize;
    this.futureObservables.next(of(null));

    // paginator.page je vystupna rura z paginatora
    this.futureObservables.next(paginator.page.pipe(
      // tap daco spravi s datami a posle ich dalej
      tap((event: PageEvent) => {
        this.pageSize = event.pageSize;
        this.indexFrom = event.pageIndex * event.pageSize;
      })
    ))
    this.futureObservables.next(filter$.pipe(
      tap(filter => {
        this.paginator.firstPage()
        this.filter = filter
      }))
    );
    this.futureObservables.next(
      sort.sortChange.pipe(
        tap((sortEvent: Sort) => {
          this.paginator.firstPage();
          if (sortEvent.direction === "") {
            this.orderBy = undefined
            this.descending = undefined
            return;
          }
          this.descending = sortEvent.direction === "desc";
          switch (sortEvent.active) {
            case "afi1998": {
              this.orderBy = "poradieVRebricku.AFI 1998";
              break;
            }
            case "afi2007": {
              this.orderBy = "poradieVRebricku.AFI 2007"
              break;
            }
            default: {
              this.orderBy = sortEvent.active
            }
          }
        })
      )
    )
  }

  connect(): Observable<Film[]> {
    return this.futureObservables.pipe(
      mergeAll(),// spoji viacero prudov poziadaviek napr. paginacia, sort...
      switchMap(event =>
        this.filmsServerService
          .getFilms(
            this.indexFrom,
            this.indexFrom + this.pageSize,
            this.filter,
            this.orderBy,
            this.descending
          ).pipe(map(response => {
            this.paginator.length = response.totalCount;
            return response.items
          }))
      )
    )
  }

  disconnect(): void {
  }


}