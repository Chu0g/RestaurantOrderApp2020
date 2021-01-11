import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { dialogMessage, dialogTitle, messageContent, messageTitle, voiceContent } from 'src/app/constant/message.constant';
import { ConfirmDialogComponent } from "src/app/dialog/confirm-dialog/confirm-dialog.component";
import { OrderFoodMenu, OrderFoodModel, PaidOrderFoodModel } from 'src/app/models/order-food.model';
import { TableModel } from "src/app/models/table.model";
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: "app-order-payment",
  templateUrl: "./order-payment.component.html",
  styleUrls: ["./order-payment.component.scss"],
})
export class OrderPaymentComponent implements OnInit {
  selectedTable: TableModel = null;
  isHideTableGroupSelection: boolean = false;

  tables: TableModel[] = [];
  pendingOrders: OrderFoodModel[] = [];
  orderedMenus: OrderFoodMenu[] = [];

  pendingOrderSub: Subscription;

  constructor(
    private modalService: NgbModal,
    private firebaseService: FirebaseService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit() {
    this.getDonePendingOrder();
  }

  getDonePendingOrder() {
    this.spinner.show();
    this.pendingOrderSub = this.firebaseService.getDonePendingOrder().subscribe((orders: OrderFoodModel[]) => {
      this.spinner.hide();
      this.pendingOrders = orders;

      if (!this.pendingOrders.length) {
        return;
      }

      this.tables = orders.map(order => order.table);
    })
  }

  onClickSelect(table: TableModel) {
    this.selectedTable = table;
    this.orderedMenus = this.pendingOrders.find(x => x.table.id === this.selectedTable.id).orderItems;
  }

  onClickHideTableGroupSelection() {
    this.isHideTableGroupSelection = true;
  }

  onClickResetSelection() {
    this.selectedTable = null;
    this.isHideTableGroupSelection = false;
  }

  onClickSubmitPayment() {
    const title = dialogTitle.PAID_CONFIRM;
    const content = dialogMessage.PAID_CONFIRM;

    const ref = this.modalService.open(ConfirmDialogComponent, {
      size: "lg",
      centered: true,
      backdrop: "static",
    });
    ref.componentInstance.title = title;
    ref.componentInstance.content = content;

    ref.result.then((confirmResult) => {
      if (confirmResult) {
        this.spinner.show();
        const paidOrderRequest: PaidOrderFoodModel = {
          orderCode: this.generateOrderCode(),
          tableId: this.selectedTable.id,
          chiefAssignedId: this.pendingOrders.find(x => x.table.id === this.selectedTable.id).chiefAssigned.identityCardCode,
          createdDate: this.generateDateString(),
          total: this.calculateTotalPrice(),
          monthRef: this.getMonthRef()
        }
        this.firebaseService.createPaidOrder(paidOrderRequest).subscribe(result => {
          if (!result) {
            this.toastr.error(messageContent.PAID_FAILED, messageTitle.FAILED);
            return;
          }

          this.toastr.success(messageContent.PAID_SUCCESS, messageTitle.SUCCESS);
          // @ts-ignore
          responsiveVoice.speak(voiceContent.CUSTOMER_THANKS, "Vietnamese Female");
          this.router.navigateByUrl('/');
        });
      }
    });
  }

  calculateTotalPrice(keyA: string = 'price', keyB: string = 'quantityHasBeenDone'): number {
    return this.orderedMenus.reduce((total, valueB) => total + (valueB[keyA] * valueB[keyB]), 0);
  }

  generateOrderCode() {
    const now = new Date();

    const date = now.getDate() > 9 ? now.getDate().toString() : '0' + now.getDate();
    const month = (now.getMonth() + 1) > 9 ? (now.getMonth() + 1).toString() : '0' + (now.getMonth() + 1);
    const year = now.getFullYear();

    const hour = now.getUTCHours() > 9 ? now.getUTCHours().toString() : '0' + now.getUTCHours();
    const minute = now.getUTCMinutes() > 9 ? now.getUTCMinutes().toString() : '0' + now.getUTCMinutes();
    const second = now.getUTCSeconds() > 9 ? now.getUTCSeconds().toString() : '0' + now.getUTCSeconds();
    return 'PO' + date + month + year + hour + minute + second;
  }

  generateDateString() {

    const now = new Date();

    const dateString = now.getDate() > 9 ? now.getDate() : "0" + now.getDate();

    const monthString = now.getMonth() + 1 > 9 ? now.getMonth() + 1 : "0" + (now.getMonth() + 1);

    return (
      dateString +
      "/" +
      monthString  +
      "/" +
      now.getFullYear()
    );
  }

  getMonthRef(): string {
    const now = new Date();
    const monthString = now.getMonth() + 1 > 9 ? now.getMonth() + 1 : "0" + (now.getMonth() + 1);
    return `${monthString}_${now.getFullYear().toString()}`;
  }
}
