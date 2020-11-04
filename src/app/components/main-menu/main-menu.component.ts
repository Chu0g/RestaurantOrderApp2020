import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {
  title = 'Quản Lý Nhà Hàng';
  user: User;

  constructor(
    private sharedDataService: SharedDataService
  ) {}
  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.user = this.sharedDataService.getUser();
  }
}
