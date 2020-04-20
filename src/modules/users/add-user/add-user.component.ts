import { Component, OnInit } from '@angular/core';
import { User } from 'src/entities/user';
import { UsersServerService } from 'src/services/users-server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userToEdit = new User("","");// meno a email je povinny
  constructor(private usersServerService: UsersServerService,
    private router:Router) { }

  ngOnInit(): void {
  }

  // sme nakopirovali z edit-user
  saveUser(user: User) {
    this.usersServerService.saveUser(user).subscribe(
      () => {
        this.router.navigateByUrl("/users/extended")        
      }
    );

  }


}
