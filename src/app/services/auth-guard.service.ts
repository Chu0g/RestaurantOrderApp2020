import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { User } from '../models/user.model';
import { SharedDataService } from './shared-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  user: User;

  constructor(private sharedDataService: SharedDataService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.role;
    this.user = this.sharedDataService.getUser();
    if (!this.user) {
      this.router.navigateByUrl('/');
    }

    if (this.user.role === expectedRole) {
      return true;
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
