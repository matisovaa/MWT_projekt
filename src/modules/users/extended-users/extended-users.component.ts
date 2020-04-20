import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { filter } from 'minimatch';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { User } from 'src/entities/user';
import { UsersServerService } from 'src/services/users-server.service';

@Component({
  selector: 'app-extended-users',
  templateUrl: './extended-users.component.html',
  styleUrls: ['./extended-users.component.css']
})
export class ExtendedUsersComponent implements OnInit, AfterViewInit {

  users: User[] = [];
  dataSource = new MatTableDataSource<User>();
  // zistenie referencie na komponent paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  columnsToDisplay = ["id", "name", "email", "lastLogin", "groups", "permissions", "actions"]
  constructor(private usersServerService: UsersServerService, private dialog: MatDialog) { }

  ngOnInit(): void {
    // namiesto toho sme dali do ngAfterViewInit
    //this.usersServerService.getExtendedUsers().subscribe(
    //  users => this.users = users
    //);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (user: User, headerName: string) => {
      switch (headerName) {
        case "groups":
          // user.groups[0]?.name;  alternativa v najnovsom tipesktipt
          return user.groups[0] ? user.groups[0].name : '';

        default:
          return user[headerName];
      }
    };

    this.dataSource.filterPredicate = (user: User, filter: string) => {
      if (user.name.toLowerCase().includes(filter)) {
        return true;
      }

      for (let group of user.groups) {
        if (group.permissions.some(perm => perm.toLowerCase().includes(filter))) {
          return true;
        }
        if (group.name.toLowerCase().includes(filter)) {
          return true;
        }
      }
      return false;
    }

    this.usersServerService.getExtendedUsers().subscribe(
      users => {
        this.dataSource.data = users;
        this.paginator.length = users.length;

      }
    );
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
    this.paginator.firstPage();
  }

  deleteUser(user: User) {
    // data treba aby bolo takeho typu ako sme si zadefinovali v dialogu
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Deleting user",
        message: "Delete user " + user.name + "?"
      }
    });
    // podla vysledku z dialogu bud mazeme alebo nie
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersServerService.deleteUser(user.id).subscribe(
          ok => {
            if (ok) {
              // filteredData je pole toho co sa aktualne zobrazuje pouzivatelovi, data su vsetky data
              // treba nahradzovat pole za pole
              this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id);
            }
          }
        );
      }
    });

  }

}
