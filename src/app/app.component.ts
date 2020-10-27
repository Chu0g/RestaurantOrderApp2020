import { Component } from '@angular/core';
import {Location} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Quản lý nhà hàng';

  constructor(private location: Location, private router: Router) {}

  changeHeaderTitle(content: string) {
    this.title = content;
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
}
