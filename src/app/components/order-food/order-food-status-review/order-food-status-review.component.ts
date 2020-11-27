import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { orderStatusContent } from "src/app/constant/status.constant";
import { OrderStatus } from "src/app/enums/order-food.enum";
import { OrderFoodMenu, OrderFoodModel } from "src/app/models/order-food.model";
import { TableModel } from "src/app/models/table.model";
import { FirebaseService } from "src/app/services/firebase.service";

@Component({
  selector: "app-order-food-status-review",
  templateUrl: "./order-food-status-review.component.html",
  styleUrls: ["./order-food-status-review.component.scss"],
})
export class OrderFoodStatusReviewComponent implements OnInit {
  @Input() selectedTable: TableModel;
  @Output() backToPreviousUI: EventEmitter<boolean> = new EventEmitter();
  @Output() isOrderCreatedBefore: EventEmitter<boolean> = new EventEmitter();

  orderedTablesSub: Subscription;
  order: OrderFoodModel;

  constructor(
    private firebaseService: FirebaseService,
  ) {}

  ngOnInit() {
    this.getOrderedTableMenu();
  }

  OnDestroy(): void {
    this.orderedTablesSub.unsubscribe();
  }

  getOrderedTableMenu() {
    this.orderedTablesSub = this.firebaseService
      .getSelectedOrder(this.selectedTable)
      .subscribe((order) => {
        this.order = order;
        if (order) {
          this.isOrderCreatedBefore.emit(true);
        } else {
          this.isOrderCreatedBefore.emit(false);
        }
      });
  }

  calculatePercentage(order: OrderFoodMenu) {
    const quantityNotStarted = order.quantityNotStarted;
    const quantityInCooking = order.quantityInCooking;
    const quantityHasBeenDone = order.quantityHasBeenDone;

    const result =
      (quantityHasBeenDone * 100) /
      (quantityNotStarted + quantityInCooking + quantityHasBeenDone);
    return result;
  }

  getProgressType(order: OrderFoodMenu) {
    const percentage = this.calculatePercentage(order);

    if (percentage === 100) {
      return "success";
    } else {
      return "warning";
    }
  }

  getOrderStatus() {
    switch (this.order.orderStatus) {
      case OrderStatus.NotStarted:
        return "not-started";
      case OrderStatus.InProgress:
        return "in-progress";
      case OrderStatus.DoneAll:
        return "done-all";
      default:
        return "not-started";
    }
  }

  getStatusString() {
    switch (this.order.orderStatus) {
      case OrderStatus.NotStarted:
        return orderStatusContent.NOT_STARTED;
      case OrderStatus.InProgress:
        return orderStatusContent.IN_COOKING;
      case OrderStatus.DoneAll:
        return orderStatusContent.DONE_ALL;
      default:
        return orderStatusContent.NOT_STARTED;
    }
  }

  backToSelectMenu() {
    this.backToPreviousUI.emit(true);
  }
}
