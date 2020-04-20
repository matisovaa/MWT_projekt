import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { map } from 'rxjs/operators';
import * as zxcvbn from 'zxcvbn';
import { Observable } from 'rxjs';
import { User } from 'src/entities/user';
import { UsersServerService } from 'src/services/users-server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  passwordMessage = '';
  hide = true;
  // model nasho formulara zodpovedny za validaciu
  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)], this.serverConflictValidator("name")),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        // https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression
        Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
      ], this.serverConflictValidator("email")),
      password: new FormControl('', this.passwordValidator()),
      password2: new FormControl('')
    },
    this.passwordsMatchValidator);// validator pre cely formular sa pise za

  constructor(private usersServerService: UsersServerService, private router: Router) { }

  ngOnInit(): void {
  }

  // aby sme s premennou mohli pracovat v sablone (.html)
  get name() {
    return this.registerForm.get('name') as FormControl;
  }

  get email() {
    return this.registerForm.get('email') as FormControl;
  }

  get password() {
    return this.registerForm.get('password') as FormControl;
  }

  get password2() {
    return this.registerForm.get('password2') as FormControl;
  }

  stringify(text: string) {
    return JSON.stringify(text);
  }

  // funkcia druheho radu, vrati nas validator
  passwordValidator(): ValidatorFn {
    return (control: FormControl): ValidationErrors => {
      const result = zxcvbn(control.value);
      const message = "Sila hesla: " + result.score + " / 4 - musi byt aspon 3" +
        result.feedback.warning + " prelomitelne za " + result.crack_times_display.offline_slow_hashing_1e4_per_second;
      this.passwordMessage = message;
      return result.score < 3 ? { weakPassword: message } : null;
    };
  }

  passwordsMatchValidator(control: FormGroup): ValidationErrors {
    const password = control.get('password');
    const password2 = control.get('password2');
    if (password.value === password2.value) {
      password2.setErrors(null);
      return null;
    } else {
      password2.setErrors({ differentPasswords: 'Passwords do not match' });
      return { differentPasswords: 'Passwords do not match' };
    }
  }

  serverConflictValidator(conflictFieldName: string): AsyncValidatorFn {
    return (control: FormControl): Observable<ValidationErrors> => {
      const username = conflictFieldName === 'name' ? control.value : '';
      const email = conflictFieldName === 'email' ? control.value : '';
      const user = new User(username, email);
      return this.usersServerService.userConflicts(user) // nasa funkcia v user-server.service.ts
        .pipe(
          map(conflictsArray => {
          return conflictsArray.includes(conflictFieldName) ?
            { conflictField: conflictFieldName + "tato hodnota uz na serveri je" } : null
        }))
    }

  }

  // https://webdisk.science.upjs.sk/~peter_gursky/webtech/films-server-javadoc/sk/gursky/films/rest/UsersController.html#register(sk.gursky.films.persist.users.User)
  formSubmit() {
    const newuser = new User( this.registerForm.get('name').value,this.registerForm.get('email').value, undefined,undefined,this.registerForm.get('password').value)

    this.usersServerService.register(newuser).subscribe(ok => {      
        this.router.navigateByUrl("/login")
    },
      error => {
        console.log("ina chyba: " + JSON.stringify(error))
      }
    )

  }

}
