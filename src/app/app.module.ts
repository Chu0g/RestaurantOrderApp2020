import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { BookTableComponent } from './components/book-table/book-table.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';
import { OrderFoodComponent } from './components/order-food/order-food.component';
import { CommonDialogComponent } from './dialog/common-dialog/common-dialog.component';
import { OrderReviewDialogComponent } from './dialog/order-review-confirm/order-review-confirm.component';

@NgModule({
  declarations: [AppComponent, MainMenuComponent, BookTableComponent, OrderFoodComponent, ConfirmDialogComponent, CommonDialogComponent, OrderReviewDialogComponent],
  imports: [CommonModule, BrowserModule, AppRoutingModule, RouterModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
