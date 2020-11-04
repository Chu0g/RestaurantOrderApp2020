import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  user: User;

  constructor(private router: Router) {
    this.user = null;
  }

  setUser(user: User) {
    this.user = user;
  }

  getUser() {
    if (!this.user) {
      this.getUserFromLocalStorage();
    }
    return this.user;
  }


  getUserFromLocalStorage() {
    const userLocalStorage = localStorage.getItem('user');
    const userObj = JSON.parse(userLocalStorage);
    if (userObj) {
      this.user = userObj;
    } else {
      this.router.navigateByUrl('/');
    }
  }

  getUserRole() {
    return this.user.role;
  }
}
