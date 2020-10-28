import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FirebaseService } from './services/firebase.service';
import { ToastrAppService } from './services/toastr.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Quản lý nhà hàng';

  username = '';
  password = '';

  constructor(
    private location: Location,
    private router: Router,
    private toastrService: ToastrAppService,
    private firebaseService: FirebaseService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  changeHeaderTitle(content: string) {
    this.title = content;
    console.log();
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

    this.firebaseService.login(this.username, authenRefString).subscribe(loginResult => {
      this.spinner.hide();

      loginResult 
      ? this.toastr.success('Success','Login Success!!!')
      : this.toastrService.error('Failed', 'Wrong username or password! Please try again.');
    });

  }
}
