import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { dialogMessage, dialogTitle, messageContent, messageTitle } from 'src/app/constant/message.constant';
import { ConfirmDialogComponent } from 'src/app/dialog/confirm-dialog/confirm-dialog.component';
import { User, UserRole } from "src/app/models/user.model";
import { FirebaseService } from "src/app/services/firebase.service";

@Component({
  selector: "app-account-management",
  templateUrl: "./account-management.component.html",
  styleUrls: ["./account-management.component.scss"],
})
export class AccountManagementComponent implements OnInit {
  users: User[] = [];
  usersFiltered: User[] = [];
  usersForView: User[] = [];

  searchText: string = '';

  totalPage: number;
  pageIndex: number = 0;
  pageSize: number = 5;

  selectedUser: User;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    this.spinner.show();
    this.firebaseService.getAllUsers().subscribe((users: User[]) => {
      this.spinner.hide();
      if (users.length) {
        this.users = users.filter((user) => user.role !== UserRole.Manager);
        this.usersForView = this.users;
        this.calculateDateAndPaging();
        this.totalPage = this.users.length;
      }
    });
  }

  returnUserRole(role: UserRole) {
    switch (role) {
      case UserRole.Waiter:
        return "Bồi bàn";
      case UserRole.Chief:
        return "Đầu bếp";
      case UserRole.Manager:
        return "Quản lý";
    }
  }

  onSelectedUser(user: User) {
    this.selectedUser = user;
  }

  activateClass(user: User) {
    if (!this.selectedUser) {
      return false;
    }

    if (this.selectedUser.identityCardCode === user.identityCardCode) {
      return true;
    }

    return false;
  }

  onModifyBtnClick(isAddForm: boolean = false) {
    if (isAddForm) {
      this.router.navigate(["/acc-management/modify"], {
        queryParams: { identityCardCode: null },
      });
    } else {
      this.router.navigate(["/acc-management/modify"], {
        queryParams: { identityCardCode: this.selectedUser.identityCardCode },
      });
    }
  }

  onDeleteBtnClick() {
    const title = dialogTitle.DELETE_USER_CONFIRM;
    const content = dialogMessage.DELETE_USER_CONFIRM + ` ${this.selectedUser.name}?`;

    const ref = this.modalService.open(ConfirmDialogComponent, {
      size: "lg",
      centered: true,
      backdrop: "static",
    });
    ref.componentInstance.title = title;
    ref.componentInstance.content = content;

    ref.result.then((confirmResult) => {
      if (confirmResult) {
        this.spinner.show();
        this.firebaseService.deleteUser(this.selectedUser.username).subscribe((result) => {
          this.spinner.hide();
          if (result) {
            this.toastr.success(
              messageContent.USER_DELETE_SUCCESS,
              messageTitle.SUCCESS
            );
            this.selectedUser = null;
            this.getUserList();
          } else {
            this.toastr.error(
              messageContent.USER_DELETE_FAILED,
              messageTitle.FAILED
            );
            return;
          }
        });
      }
    });
  }

  onChangeSelectedPage(pageIndex: number) {
    this.pageIndex += pageIndex;
    this.calculateDateAndPaging();
  }

  onSearchChange(searchString: string) {
    this.searchText = searchString;
    if (searchString) {
      this.usersFiltered = this.users.filter(x => x.name.toLowerCase().includes(this.searchText.toLowerCase()));
    }
    
    this.calculateDateAndPaging();
  }

  calculateDateAndPaging() {
    const start = this.pageIndex * this.pageSize;
    const end = ((this.pageIndex + 1) * this.pageSize);

    if (this.searchText) {
      this.usersForView = this.usersFiltered.slice(start, end);
    } else {
      this.usersForView = this.users.slice(start, end);
    }

    this.selectedUser = null;
  }
}
