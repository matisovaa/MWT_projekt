import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanDeactiveComponent {
  canDeactivate: () => Observable<boolean> | boolean
}

@Injectable({
  providedIn: 'root'
})

export class CanDeactivateGuard implements CanDeactivate<CanDeactiveComponent> {
  canDeactivate(component: CanDeactiveComponent, _currentRoute: ActivatedRouteSnapshot,
    _currentState: RouterStateSnapshot, _nextState: RouterStateSnapshot)
    : Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate() //? component.canDeactivate() : true;
  }

  /*  
  
  export class CanDeactivateGuard implements CanActivate {
    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return true;
    }*/

}
