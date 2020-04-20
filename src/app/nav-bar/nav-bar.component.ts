import { Component, OnInit } from '@angular/core';
import { UsersServerService } from '../../services/users-server.service';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { AuthState, AuthModel } from 'src/shared/auth.state';
import { Observable } from 'rxjs';
import { Logout } from 'src/shared/auth.actions';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  username: string = "";

  // ziskanie instancie na ulozisko do premennej (moze toho byt vela ale my si z toho musime u seba vyberat co chceme)
  //@Select(AuthState) authState$: Observable<AuthModel>;
  // alternativne aby sme netahali cely stav ale len to co potrebujeme
  //@Select(state => state.auth.username) username$: Observable<string>
  // alternativne pomocou vlasneho selectora v auth.state.ts
  @Select(AuthState.username) username$: Observable<string>

  constructor(private userServerService: UsersServerService,
    private router: Router,
    private store: Store) { }

  ngOnInit(): void {

    /*this.authState$.subscribe(authModel => {
      this.username = authModel.username;
    })*/
    // alternaivne
    this.username$.subscribe(username => {
      this.username = username;
    })

    // budeme ziskavat z uloziska aby v userServerService sme neukladali stav
    /*this.userServerService.getCurrentUser().subscribe(username => {
      this.username = username;
    })*/
  }

  logout() {
    this.store.dispatch(new Logout()).subscribe(() => {
      this.router.navigateByUrl('/login');
    })

    // namiesto tohto to riesime cez ulozisko
    //this.userServerService.logout();

  }

}
