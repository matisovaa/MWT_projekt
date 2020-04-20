import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Film } from 'src/entities/film';
import { Observable } from 'rxjs';
import { UsersServerService } from './users-server.service';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilmsServerService {

  url = 'http://localhost:8080/films';
  constructor(private http: HttpClient,
    private usersServerService: UsersServerService) { }

  get token() {
    return this.usersServerService.token
  }

  private getHeader(): {
    // treba si definovat vlastny typ vystupu aby to dobre fungovalo
    headers?: { 'X-Auth-Token': string },
    params?: HttpParams
  } {
    return this.token ?
      {
        headers:
          { 'X-Auth-Token': this.token }
      }
      : undefined;
  }

  getFilms(indexFrom?: number,
    indexTo?: number, search?: string,
    orderBy?: string,
    descending?: boolean
  ): Observable<FilmsResponce> {
    let httpOptions = this.getHeader();

    if (indexFrom || indexTo || search || orderBy || descending) {
      // (httpOptions||{}) koli tomu ak by getHeader() vratilo undefined
      httpOptions = { ...(httpOptions || {}), params: new HttpParams() };
    }

    if (indexFrom) {
      httpOptions.params = httpOptions.params.set('indexFrom', '' + indexFrom);
    }
    if (indexTo) {
      httpOptions.params = httpOptions.params.set('indexTo', '' + indexTo);
    }
    if (search) {
      httpOptions.params = httpOptions.params.set('search', search);
    }
    if (orderBy) {
      httpOptions.params = httpOptions.params.set('orderBy', orderBy);
    }
    if (descending) {
      httpOptions.params = httpOptions.params.set('descending', '' + descending);
    }

    // modifikujeme http hlavicku aby sme tu poslali aj token
    return this.http
      .get<FilmsResponce>(this.url, httpOptions)
      .pipe(tap(resp => console.log(resp)));
  }

  getFilm(id: number): Observable<Film> {
    let httpOptions = this.getHeader();

    // modifikujeme http hlavicku aby sme tu poslali aj token
    return this.http
      .get<Film>(this.url+"/"+id, httpOptions)
      .pipe(tap(resp => console.log(resp)));
  }
 
  saveFilm(film: Film): Observable<Film> {  
    console.log(film)  
    return this.http.post<Film>(this.url, film, this.getHeader())
    .pipe(tap(resp => console.log(resp)));
  }  

}

export interface FilmsResponce {
  items: Film[],
  totalCount: number
}