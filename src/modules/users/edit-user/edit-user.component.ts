import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UsersServerService } from 'src/services/users-server.service';
import { switchMap, map } from 'rxjs/operators';
import { User } from 'src/entities/user';
import { CanDeactiveComponent } from 'src/guards/can-deactivate.guard';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit, CanDeactiveComponent {

  userToEdit: User;
  userSaved = false;

  constructor(private route: ActivatedRoute, 
    private usersServerService: UsersServerService,
    private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data) => {
        this.userSaved = false;
        this.userToEdit = data.user;
      }
    )

    // funkcionalita nahradena pomcou resolver
    /*
        this.route.paramMap.pipe(
          // switchMap prerusi volanie na server ak uz chceme daco ine a pyta od servera nove
          switchMap((params: ParamMap) =>
            // z url aderesi sme si zobrali id
            this.usersServerService.getUser(+params.get("id")) // to + je pretipovanie stringu na number
          )
        ).subscribe((user: User) => {
          this.userSaved = false;
          this.userToEdit = user
        })*/
  }

  saveUser(user: User) {
    this.usersServerService.saveUser(user).subscribe(
      () => {
        this.router.navigateByUrl("/users/extended")
        this.userSaved = true; // koli guardovi
      }
    );

  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.userSaved) {
      return true;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Leaving?",
        message: "Edited user is not saved, leave?"
      }
    });
    return dialogRef.afterClosed().pipe(map((result) => !!result));
  }

}
