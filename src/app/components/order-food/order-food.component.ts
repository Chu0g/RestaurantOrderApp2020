import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import {
  dialogTitle,
  messageContent,
  messageTitle,
} from "src/app/constant/message.constant";
import { OrderReviewDialogComponent } from "src/app/dialog/order-review-confirm/order-review-confirm.component";
import { CookStatus, OrderStatus } from "src/app/enums/order-food.enum";
import { OrderFoodMenu, OrderFoodModel } from "src/app/models/order-food.model";
import { TableModel } from "src/app/models/table.model";
import { FirebaseService } from "src/app/services/firebase.service";

@Component({
  selector: "app-order-food",
  templateUrl: "./order-food.component.html",
  styleUrls: ["./order-food.component.scss"],
})
export class OrderFoodComponent implements OnInit {
  menu: OrderFoodMenu[] = [];
  oldMenu: OrderFoodMenu[] = [];

  currentUnavailableTables: TableModel[] = [];

  selectedTable: TableModel = null;
  isHideTableGroupSelection = false;
  alreadyCreatedPendingOrder = false;

  constructor(
    private modalService: NgbModal,
    private firebaseService: FirebaseService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getUnavailableTables();
  }

  getUnavailableTables() {
    this.spinner.show();
    this.firebaseService
      .getUnavailableTables()
      .subscribe((unavailableTables) => {
        this.currentUnavailableTables = unavailableTables;
        this.spinner.hide();
      });
  }

  onClickSelect(table: TableModel) {
    this.selectedTable = table;
  }

  isTableSelected() {
    return this.selectedTable;
  }

  onClickHideTableGroupSelection() {
    this.isHideTableGroupSelection = true;
    this.spinner.show();
    this.firebaseService
      .getPendingOrder(this.selectedTable.tableCode)
      .subscribe((pendingOrder: OrderFoodModel) => {
        if (pendingOrder) {
          this.alreadyCreatedPendingOrder = true;
        }

        this.firebaseService.getFoodMenu().subscribe((menu) => {
          this.spinner.hide();
          if (!menu) {
            this.toastr.error(
              messageContent.GET_MENU_FAILED,
              messageTitle.FAILED
            );
            return;
          }

          this.menu = menu.map((item) => {
            item.quantityNotStarted = 0;
            item.quantityInCooking = 0;
            item.quantityHasBeenDone = 0;
            item.cookStatus = CookStatus.NotDone;
            return item;
          });

          if (this.alreadyCreatedPendingOrder) {
            this.menu.forEach((item) => {
              const correspondMenuItem = pendingOrder.orderItems.find(
                (x) => x.id === item.id
              );
              if (correspondMenuItem) {
                item.quantityNotStarted = correspondMenuItem.quantityNotStarted;
                item.quantityInCooking = correspondMenuItem.quantityInCooking;
                item.quantityHasBeenDone =
                  correspondMenuItem.quantityHasBeenDone;
              }
            });

            this.oldMenu = this.menu;
          }
        });
      });
  }

  onClickResetSelection() {
    this.selectedTable = null;
    this.isHideTableGroupSelection = false;
    this.alreadyCreatedPendingOrder = false;
  }

  onClickMinus(menuFoodId: string) {
    this.menu = this.menu.map((item) => {
      if (item.id === menuFoodId) {
        item.quantityNotStarted--;
      }

      return item;
    });
  }

  onClickPlus(menuFoodId: string) {
    this.menu = this.menu.map((item) => {
      if (item.id === menuFoodId) {
        item.quantityNotStarted++;
      }

      return item;
    });
  }

  isFoodOrdered() {
    const itemHasQuantityInMenu = this.menu.filter(
      (x) => x.quantityNotStarted > 0
    );

    if (itemHasQuantityInMenu.length > 0) {
      return false;
    }
    return true;
  }

  onClickSubmitOrder() {
    const orderSelected = this.menu.filter((x) => x.quantityNotStarted > 0);

    const title = dialogTitle.ORDER_FOOD_CONFIRM;

    const ref = this.modalService.open(OrderReviewDialogComponent, {
      size: "lg",
      centered: true,
      backdrop: "static",
    });
    ref.componentInstance.title = title;
    ref.componentInstance.orders = orderSelected;

    ref.result.then((confirmResult) => {
      if (confirmResult) {
        const orderFoodModel: OrderFoodModel = {
          table: this.selectedTable,
          chiefAssigned: null,
          orderItems: orderSelected,
          orderStatus: OrderStatus.NotStarted,
        };

        if (!this.alreadyCreatedPendingOrder) {
          this.spinner.show();
          this.firebaseService
            .createPendingOrder(orderFoodModel)
            .subscribe((createResult) => {
              this.spinner.hide();
              if (createResult) {
                this.toastr.success(
                  messageContent.ORDER_FOOD_SUCCESS,
                  messageTitle.SUCCESS
                );
              } else {
                this.toastr.error(
                  messageContent.ORDER_FOOD_FAILED,
                  messageTitle.FAILED
                );
                return;
              }
            });
        } else {
          const updateFoodRequest = this.menu.filter(
            (x) =>
              x.quantityNotStarted !== 0 ||
              x.quantityInCooking !== 0 ||
              x.quantityHasBeenDone !== 0
          );

          this.firebaseService.updatePendingOrder(updateFoodRequest, this.selectedTable.id).subscribe(result => {
            
          });
        }
      }
    });
  }

  calculateTotalPrice() {
    let totalPrice = 0;

    const orderSelected = this.menu.filter((x) => x.quantityNotStarted > 0);

    orderSelected.forEach((item) => {
      totalPrice +=
        item.price *
        (item.quantityNotStarted +
          item.quantityInCooking +
          item.quantityHasBeenDone);
    });

    return totalPrice;
  }
}
