import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})

export class MainMenuComponent implements OnInit {
  @ViewChild(AppComponent) app: AppComponent;

  title = 'Quản Lý Nhà Hàng';

  constructor(private titleService: Title) {}
  ngOnInit() {
    this.titleService.setTitle(this.title.toLocaleUpperCase());
  }

  onClickStartOrdering() {}

  onClickStartPaying() {}
}
