import { Injectable } from '@angular/core';
import { User } from '../entities/user';
import { Observable, of, throwError, EMPTY, Subscriber } from 'rxjs';
import { map, catchError, tap, mapTo } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../entities/auth';
import { error } from 'protractor';
import { SnackbarService } from './snackbar.service';
import { Group } from 'src/entities/group';
import { Store } from '@ngxs/store';
import { TokenExpiredLogout } from 'src/shared/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class UsersServerService {

  localUsers = [new User("Janka", "janka@j.sk"),
  new User("Danka", "danka@d.sk")
  ];

  url = "http://localhost:8080/";
  // private token: string = null; // budeme to ukladat v prehliadaci a nie do lokalnej premennej

  // lebo budeme to brat z uloziska
  //loggedUserSubscriber: Subscriber<string>; // referencia na zaciatok rury pre nav-bar

  // sme dali do uloziska
  //redirectAfterLogin = '/users/extended'

  // mozeme injectovat service aj do service ale pozor na cyklus
  constructor(private http: HttpClient,
    private snackbarService: SnackbarService,
    private store: Store) { }

  get token(): string {
    return this.store.selectSnapshot(state => state.auth.token)
  }

  checkToken(): Observable<void> {
    if (this.token == null) {
      // nebol ulozeny token, takze netreba nic robit
      return of(undefined)
    }

    return this.http
      .get(this.url + "check-token/" + this.token,
        { responseType: 'text' })
      .pipe(
        mapTo(undefined),// token je aktualny
        // ak pride error tak informujeme ulozisko, ze token je expirovany
        catchError(error => this.processHttpError(error))
      );
  }



  // uz nepotrebujeme, lebo si to ukladame priamo v prehliadaci
  /*
  // token si ukladame rovno v prehliadaci
  get token(): string {
    return localStorage.getItem("token")
  }

  set token(token: string) {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }

  get user(): string {
    return localStorage.getItem("user")
  }

  set user(user: string) {
    if (user) {
      localStorage.setItem('user', user)
    } else {
      localStorage.removeItem('user')
    }
  }
*/

  getUsers(): Observable<User[]> {
    // return [new User("Janka", "janka@j.sk"),    new User("Danka", "danka@d.sk")   ];
    //return of(this.localUsers); // vyraba prud

    //return this.http.get<User[]>(this.url + 'users1'); // na symulovanie error

    return this.http.get<User[]>(this.url + 'users') // objekty co sa tvaria ako User ale nemaju metody
      .pipe(catchError(error => this.processHttpError(error)));

  }

  getGroups(): Observable<Group[]> {


    return this.http.get<Group[]>(this.url + 'groups')
      .pipe(catchError(error => this.processHttpError(error)));

  }

  getExtendedUsers(): Observable<User[]> {

    return this.http.get<User[]>(this.url + 'users/' + this.token)
      .pipe(catchError(error => this.processHttpError(error)));

  }

  getUser(id: number): Observable<User> {

    return this.http.get<User>(this.url + 'user/' + id + '/' + this.token)
      .pipe(catchError(error => this.processHttpError(error)));

  }

  saveUser(user: User): Observable<User> {
    return this.http.post<User>(this.url + 'users/' + this.token, user)
      .pipe(catchError(error => this.processHttpError(error)));
  }

  // bolo Observable<Boolean>
  login(auth: Auth): Observable<string> {
    // responseType, lebo od servera nedostaneme objekt ale len text (token)
    return this.http.post(this.url + 'login', auth, { responseType: 'text' })
      .pipe(
        tap(token => {
          // toto sa uz riesi cez ulozisko
          // this.token = token; // tu sa zavola sam setter
          // this.user = auth.name;
          // this.loggedUserSubscriber.next(this.user)
          this.snackbarService.successMessage("Login successfull")

        }
          /*
          map(token => {
            this.token = token; // tu sa zavola sam setter
            this.user = auth.name;
            this.loggedUserSubscriber.next(this.user)
            this.snackbarService.successMessage("Login successfull")
            return token;
          }*/
        ),
        catchError(error => this.processHttpError(error))
      );
  }

  logout(token): Observable<void> {

    // uz riesime cez ulozisko
    // this.user = null;
    //this.loggedUserSubscriber.next(null);
    /*this.http.get(this.url + 'logout/' + this.token)
      .pipe(catchError(error => this.processHttpError(error)))
      .subscribe();
    this.token = null;
    */

    return this.http.get(this.url + 'logout/' + token)
      .pipe(
        mapTo(undefined),// ked je get uspesny tak do rury dame undefined
        catchError(error => this.processHttpError(error)));
  }

  userConflicts(user: User): Observable<string[]> {
    return this.http.post<string[]>(this.url + 'user-conflicts', user)
      .pipe(catchError(error => this.processHttpError(error)));
  }

  register(newuser: User): Observable<User> {
    return this.http.post<User>(this.url + 'register', newuser)
      .pipe(catchError(error => this.processHttpError(error)));
  }

  deleteUser(userId: number): Observable<boolean> {
    return this.http.delete(this.url + 'user/' + userId + '/' + this.token)
      .pipe(
        map(() => true))
      .pipe(catchError(error => this.processHttpError(error)))
      ;
  }

  private processHttpError(error) {
    // za && to ono automaticky pretypovalo error na typ HttpErrorResponse, lebo inak by to cez && nepreslo
    // predtym error instanceof HttpErrorResponse &&
    error.status === 401
    if (error instanceof HttpErrorResponse) {
      // v tomto if to error automaticky pretipovalo na HttpErrorResponse
      this.httpErrorToMessage(error)
      return EMPTY;// vrati zavretu ruru  //of(false);
    }

    // ked sa dostaneme tu tak je to ine nez 200, 401, je to napr 0(server nedostupny)
    // ked dojdeme tu tak sme spravili programatorsku chybu a nech je to v konzole
    return throwError(error)

  }

  private httpErrorToMessage(error: HttpErrorResponse): void {
    console.log(JSON.stringify(error))
    if (error.status == 0) {
      this.snackbarService.errorMessage("Server unreachable");
      return;
    }

    // chyby od pouzivatela, 400 
    if (error.status >= 400 && error.status < 500) {
      // osetrenie ci to server poslal ako string alebo rovno objekt
      const message = error.error.errorMessage ?
        error.error.errorMessage :
        JSON.parse(error.error).errorMessage;


      if (error.status === 401 && message == "unknown token") {
        this.store.dispatch(new TokenExpiredLogout());
        this.snackbarService.errorMessage("Session timeout");
        return;
      }

      this.snackbarService.errorMessage(message);
      return;
    }
    // nevieme si to teraz nasymulovat
    this.snackbarService.errorMessage("server error: " + error.message)

  }

  // nepouzivame lebo bereme z uloziska
  /*
  getCurrentUser(): Observable<string> {
    // konstruktor v ktorom dodame funkciu
    return new Observable<string>(subcriber => {   // subcriber je akoby zaciatok rury
      this.loggedUserSubscriber = subcriber;
      subcriber.next(this.user);
    });

  }*/



}
