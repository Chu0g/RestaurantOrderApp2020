import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountManagementComponent } from './components/account-management/account-management.component';
import { AccountModifyFormComponent } from './components/account-management/account-modify-form/account-modify-form.component';
import { BookTableComponent } from './components/book-table/book-table.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { OrderFoodComponent } from './components/order-food/order-food.component';
import { OrderProcessComponent } from './components/order-process/order-process.component';
import { UserRole } from './models/user.model';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'book', component: BookTableComponent, canActivate: [AuthGuard], data: { role: UserRole.Waiter } },
  { path: 'order', component: OrderFoodComponent, canActivate: [AuthGuard], data: { role: UserRole.Waiter } },
  { path: 'cook', component: OrderProcessComponent, canActivate: [AuthGuard], data: { role: UserRole.Chief } },
  { path: 'acc-management', canActivate: [AuthGuard], data: {role: UserRole.Manager},
    children: [
        { path: '', component: AccountManagementComponent },
        { path: 'modify', component: AccountModifyFormComponent }
    ] 
  },

  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
