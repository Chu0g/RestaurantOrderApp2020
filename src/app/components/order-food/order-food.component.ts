import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonDialogComponent } from "src/app/dialog/common-dialog/common-dialog.component";
import { OrderReviewDialogComponent } from "src/app/dialog/order-review-confirm/order-review-confirm.component";
import { OrderFoodMenu } from "src/app/models/order-food.model";

@Component({
  selector: "app-order-food",
  templateUrl: "./order-food.component.html",
  styleUrls: ["./order-food.component.scss"],
})
export class OrderFoodComponent implements OnInit {
  menu: OrderFoodMenu[] = [
    { id: "1", name: "Thịt kho hột vịt", price: 20000, quantity: 0 },
    { id: "2", name: "Xương heo hầm măng", price: 55000, quantity: 0 },
    { id: "3", name: "Cá chép kho tương", price: 60000, quantity: 0 },
    { id: "4", name: "Trứng ốp la", price: 15000, quantity: 0 },
    { id: "5", name: "Đậu hủ chiên", price: 8000, quantity: 0 },
    { id: "6", name: "Canh hủ qua nhồi thịt", price: 30000, quantity: 0 },
    { id: "7", name: "Canh chua cá chuối", price: 35000, quantity: 0 },
    { id: "8", name: "Xào thập cẩm", price: 23000, quantity: 0 },
  ];

  currentUnavailableTables: string[] = ["3", "5", "7", "10"];

  selectedTable: number = null;
  isHideTableGroupSelection: boolean = false;

  constructor(private modalService: NgbModal) {}
  ngOnInit() {}

  onClickSelect(tableIndex: number) {
    this.selectedTable = tableIndex;
  }

  isTableSelected() {
    return this.selectedTable > 0;
  }

  onClickHideTableGroupSelection() {
    this.isHideTableGroupSelection = true;
  }

  onClickResetSelection() {
    this.selectedTable = null;
    this.isHideTableGroupSelection = false;
  }

  onClickMinus(menuFoodId: string) {
    this.menu = this.menu.map((item) => {
      if (item.id === menuFoodId) {
        item.quantity--;
      }

      return item;
    });
  }

  onClickPlus(menuFoodId: string) {
    this.menu = this.menu.map((item) => {
      if (item.id === menuFoodId) {
        item.quantity++;
      }

      return item;
    });
  }

  isFoodOrdered() {
    const itemHasQuantityInMenu = this.menu.filter((x) => x.quantity > 0);

    if (itemHasQuantityInMenu.length > 0) {
      return false;
    }
    return true;
  }

  onClickSubmitOrder() {
    const orderSelected = this.menu.filter((x) => x.quantity > 0);

    const title = `Xác nhận đặt món?`;

    const ref = this.modalService.open(OrderReviewDialogComponent, {
      size: "lg",
      centered: true,
      backdrop: "static",
    });
    ref.componentInstance.title = title;
    ref.componentInstance.orders = orderSelected;

    ref.result.then((confirmResult) => {
      if (confirmResult) {
          const alertTitle = `Thành công`;
          const content = `Đặt món thành công! Quý khách vui lòng đợi trong giây lát.`;
          const commonRef = this.modalService.open(CommonDialogComponent, {
            size: "lg",
            centered: true,
            backdrop: "static",
          });
          commonRef.componentInstance.title = alertTitle;
          commonRef.componentInstance.content = content;
      }
    });
  }

  calculateTotalPrice() {
    let totalPrice = 0;

    const orderSelected = this.menu.filter((x) => x.quantity > 0);

    orderSelected.forEach((item) => {
        totalPrice += item.price * item.quantity;
    });

    return totalPrice;
  }
}
