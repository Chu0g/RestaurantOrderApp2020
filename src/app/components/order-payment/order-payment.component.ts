import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonDialogComponent } from "src/app/dialog/common-dialog/common-dialog.component";
import { ConfirmDialogComponent } from 'src/app/dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: "app-order-payment",
  templateUrl: "./order-payment.component.html",
  styleUrls: ["./order-payment.component.scss"],
})
export class OrderPaymentComponent implements OnInit {

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

  onClickSubmitPayment() {

    const title = `Xác nhận thanh toán?`;
    const content = `Quý khách đã thanh toán?`

    const ref = this.modalService.open(ConfirmDialogComponent, {
      size: "lg",
      centered: true,
      backdrop: "static",
    });
    ref.componentInstance.title = title;
    ref.componentInstance.content = content;

    ref.result.then((confirmResult) => {
      if (confirmResult) {
          const alertTitle = `Thành công`;
          const thanksfulContent = `Cảm ơn quý khách, hẹn gặp lại!`;
          const commonRef = this.modalService.open(CommonDialogComponent, {
            size: "lg",
            centered: true,
            backdrop: "static",
          });
          commonRef.componentInstance.title = alertTitle;
          commonRef.componentInstance.content = thanksfulContent;
      }
    });
  }

  calculateTotalPrice() {
    let totalPrice = 140000;
    return totalPrice;
  }
}
