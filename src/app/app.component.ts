import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FirebaseService } from './services/firebase.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  dialogMessage,
  dialogTitle,
  messageContent,
  messageTitle,
} from './constant/message.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from './models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';
import { SharedDataService } from './services/shared-data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = messageContent.WELCOME_DEFAULT;

  username = '';
  password = '';

  loginForm: FormGroup;
  user: User = null;

  constructor(
    private location: Location,
    private router: Router,
    private firebaseService: FirebaseService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private sharedDataService: SharedDataService
  ) {
    this.checkLocalStorage();
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  checkLocalStorage() {
    const userLocalStorage = localStorage.getItem('user');
    const userObj = JSON.parse(userLocalStorage);
    if (userObj) {
      this.user = userObj;
      this.changeHeaderTitle();
    } else {
      this.router.navigateByUrl('/');
    }
  }

  changeHeaderTitle() {
    this.title = messageContent.WELCOME_USER + this.user.name;
  }

  moveBackward() {
    this.location.back();
  }

  isHomePage() {
    if (this.router.url === '/') {
      return true;
    }

    return false;
  }

  onChangeUsername(value) {
    this.username = value;
  }

  onChangePassword(value) {
    this.password = value;
  }

  onClickLogin(e) {
    e.preventDefault();

    this.spinner.show();

    const authenRefString = `${this.username}_${this.password}`;

    this.firebaseService
      .login(this.username, authenRefString)
      .subscribe((loginResult) => {
        this.spinner.hide();

        if (loginResult) {
          this.toastr.success(
            messageContent.LOGIN_SUCCESS,
            messageTitle.SUCCESS
          );
          this.firebaseService
            .getUserInfo(authenRefString)
            .subscribe((user: User) => {
              if (user) {
                this.user = user;
                this.changeHeaderTitle();
                localStorage.setItem('user', JSON.stringify(this.user));
                this.sharedDataService.user = this.user;
              } else {
                this.toastr.error(
                  messageContent.GET_USER_INFO_FAILED,
                  messageTitle.FAILED
                );
                this.clearAllLoginData();
              }
            });
        } else {
          this.toastr.error(messageContent.LOGIN_FAILED, messageTitle.FAILED);
        }
      });
  }

  logout() {
    const title = dialogTitle.LOG_OUT_TITLE;
    const content = dialogMessage.LOG_OUT_MESSAGE;

    const ref = this.modalService.open(ConfirmDialogComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });
    ref.componentInstance.title = title;
    ref.componentInstance.content = content;

    ref.result.then((confirmResult) => {
      if (confirmResult) {
        this.clearAllLoginData();
        localStorage.removeItem('user');
        this.router.navigateByUrl('/');
        this.title = messageContent.WELCOME_DEFAULT;
        this.toastr.success(messageContent.LOG_OUT_SUCCESS, messageTitle.SUCCESS);
      }
    });
  }

  private clearAllLoginData() {
    this.user = null;
    this.username = '';
    this.password = '';
    this.loginForm.reset();
  }
}
