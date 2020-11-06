import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { OrderFoodMenu } from 'src/app/models/order-food.model';

@Component({
  selector: 'app-order-review-confirm-dialog',
  templateUrl: './order-review-confirm.component.html',
  styleUrls: ['./order-review-confirm.component.scss'],
})

export class OrderReviewDialogComponent implements OnInit{
  title: string;
  orders: OrderFoodMenu[];

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  calculateTotalPrice() {
    let totalPrice = 0;

    this.orders.forEach((item) => {
        totalPrice += item.price * item.quantityNotStarted;
    });

    return totalPrice;
  }
}
