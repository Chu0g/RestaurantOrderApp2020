import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { BookTableComponent } from './components/book-table/book-table.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';
import { OrderFoodComponent } from './components/order-food/order-food.component';
import { CommonDialogComponent } from './dialog/common-dialog/common-dialog.component';
import { OrderReviewDialogComponent } from './dialog/order-review-confirm/order-review-confirm.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    BookTableComponent,
    OrderFoodComponent,
    ConfirmDialogComponent,
    CommonDialogComponent,
    OrderReviewDialogComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-full-width',
      preventDuplicates: true
    }),
    AppRoutingModule,
    RouterModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
