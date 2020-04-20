import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectingPreloadingStrategyService implements PreloadingStrategy {

  constructor() { }

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // ak najde v data preloading tak to urobi preload
    if (route.data && route.data.preloading) {
      console.log('Preloaded: ' + route.path);
      return load();
    } else {
      // inak to naloaduje az na poziadanie (uzivatel pride na tu adresu)
      return of(null);
    }

  }
}
