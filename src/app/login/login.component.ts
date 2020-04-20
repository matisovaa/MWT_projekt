import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/entities/auth';
import { UsersServerService } from '../../services/users-server.service';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login } from 'src/shared/auth.actions';
import { AuthState } from 'src/shared/auth.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  auth: Auth = new Auth();
  hide = true;

  constructor(private usersServerService: UsersServerService,
    private router: Router,
    private store: Store) { }

  ngOnInit(): void {
  }

  get vypisAuth(): string {
    return JSON.stringify(this.auth);
  }

  // netreba vstupy, lebo v premennej auth uz mam vsetko a je synchronizovana s form
  formSubmit() {
    this.store.dispatch(new Login(this.auth))
      .subscribe(() => {
        console.log("Udalost login spracovana");
        this.router.navigateByUrl(this.store.selectSnapshot(AuthState.redirectUrl));
        //this.router.navigateByUrl(this.usersServerService.redirectAfterLogin);
        //this.usersServerService.redirectAfterLogin = "/users/extended"
      })

    // namiesto servisu kontaktujeme storage
    /*
    this.usersServerService.login(this.auth).subscribe(ok => {
      // netreba if, lebo sme to vyriesili smackbar
      //if (ok) {
        //console.log("Uspesne pripojenie na server!")
        this.router.navigateByUrl(this.usersServerService.redirectAfterLogin);
        this.usersServerService.redirectAfterLogin = "/users/extended"
      //} else {
        //console.log("Zly login alebo heslo!")
      //}

    },// uz sme tiez nahradili smackbar
      error => {
        console.log("ina chyba: " + JSON.stringify(error))
      }
    )*/

  }

}
