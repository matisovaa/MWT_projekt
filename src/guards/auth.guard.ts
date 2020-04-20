import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, UrlSegment, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersServerService } from 'src/services/users-server.service';
import { Store } from '@ngxs/store';
import { UrlAfterLogin } from 'src/shared/auth.actions';
import { tap, mapTo } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private usersServerService: UsersServerService,
    private router: Router,
    private store: Store) { }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    return this.canAnything(route.path)
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean
      | UrlTree> | Promise<boolean | UrlTree>
    | boolean | UrlTree {
    return this.canAnything(state.url)
  }

  canAnything(url: string): boolean | Observable<boolean> {

    // synchronne ziskanie aktualneho stavu uloziska
    if (this.store.selectSnapshot(state => state.auth.token)) {
      return true;
    }
    /*// toto nahradime tym ze to ziskavame zo store
    if (this.usersServerService.token) {
      return true;
    }*/

    //this.usersServerService.redirectAfterLogin = url;
    return this.store.dispatch(new UrlAfterLogin(url))
      .pipe(
        tap(() => {
          this.router.navigateByUrl("/login");
        }),
        mapTo(false)
      )
  }

}
