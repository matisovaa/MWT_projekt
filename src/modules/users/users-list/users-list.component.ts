import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/entities/user';
import { UsersServerService } from 'src/services/users-server.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: User[] =
    [new User("Peter", "peto@gmail.com"),
    new User("Jozo", "jozo@gmail.com", 2, new Date("2020-01-17"))];

  selectedUser: User;
  users$: Observable<User[]>; // premenne ukoncene $ je zvyk pmenuvat premenu prudu
  columnsToDisplay = ["id","name", "email"]

  constructor(private usersServerService: UsersServerService) { }

  ngOnInit(): void {
    //this.users = this.usersServerService.getUsers();
    this.usersServerService.getUsers().subscribe(
      users => this.users = users,
      error => {
        window.alert("Mame chybu: " + JSON.stringify(error));
      }
      ); // robi s prudom
    this.users$ = this.usersServerService.getUsers(); // (users$ | async) v .html dodame ale ono to vyhodi err ak nepridu data
  }

  selectUser(user: User) { this.selectedUser = user; }

}
