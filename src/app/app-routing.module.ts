import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookTableComponent } from './components/book-table/book-table.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { OrderFoodComponent } from './components/order-food/order-food.component';
import { OrderPaymentComponent } from './components/order-payment/order-payment.component';

const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'book', component: BookTableComponent },
  { path: 'order', component: OrderFoodComponent },
  { path: 'payment', component: OrderPaymentComponent},
  { path: '**', component: MainMenuComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
