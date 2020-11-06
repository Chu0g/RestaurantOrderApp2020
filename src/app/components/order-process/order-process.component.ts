import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  dialogMessage,
  dialogTitle,
  messageContent,
  messageTitle,
} from 'src/app/constant/message.constant';
import { CommonDialogComponent } from 'src/app/dialog/common-dialog/common-dialog.component';
import { ConfirmDialogComponent } from 'src/app/dialog/confirm-dialog/confirm-dialog.component';
import { CookStatus, OrderStatus } from 'src/app/enums/order-food.enum';
import { OrderFoodMenu, OrderFoodModel } from 'src/app/models/order-food.model';
import { TableModel } from 'src/app/models/table.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-order-process',
  templateUrl: './order-process.component.html',
  styleUrls: ['./order-process.component.scss'],
})
export class OrderProcessComponent implements OnInit {
  chief: User;
  orderedTable: OrderFoodModel[] = [];
  tableList: TableModel[] = [];
  menuInfo: OrderFoodModel;
  isHideTableGroupSelection = false;

  selectedOrder: OrderFoodModel;

  orderedTablesSub: Subscription;
  assignedTableSub: Subscription;

  constructor(
    private firebaseService: FirebaseService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit() {
    this.getOrderedTable();
    this.chief = this.sharedDataService.getUser();
  }

  OnDestroy(): void {
    this.orderedTablesSub.unsubscribe();
    this.assignedTableSub.unsubscribe();
  }

  getOrderedTable() {
    this.spinner.show();
    this.orderedTablesSub = this.firebaseService
      .getOrderedTable()
      .subscribe((orderedTable) => {
        this.spinner.hide();
        if (this.orderedTable.length < orderedTable.length) {
          this.toastr.info(messageContent.NEW_ORDER_UPDATED, messageTitle.INFO);
        }
        if (orderedTable) {
          this.orderedTable = orderedTable;
          this.tableList = orderedTable.map((x) => x.table);
        }
      });
  }

  onClickSelect(table: TableModel) {
    this.menuInfo = this.orderedTable.find(
      (x) => x.table.tableCode === table.tableCode
    );

    const title = dialogTitle.VIEW_FOOD_ORDER + table.id;
    let content = '';

    if (this.menuInfo.chiefAssigned) {
      content += `Người đảm nhiệm bàn này: ${this.menuInfo.chiefAssigned.name} \n -------------------------------------------- \n`;
    }
    this.menuInfo.orderItems.forEach((item) => {
      content += `${item.name} - ${item.quantityNotStarted} phần \n`;
    });

    const ref = this.modalService.open(CommonDialogComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    ref.componentInstance.title = title;
    ref.componentInstance.content = content;
  }

  onClickHideTableGroupSelection(table: TableModel) {
    this.menuInfo = this.orderedTable.find(
      (x) => x.table.tableCode === table.tableCode
    );

    const title =
      dialogTitle.ORDER_TAKE_CONFIRM_FIRST_HALF +
      table.id +
      dialogTitle.ORDER_TAKE_CONFIRM_LAST_HALF;

    let content = dialogMessage.ORDER_TAKE_CONFIRM;

    if (
      this.menuInfo.chiefAssigned &&
      this.chief.employeeCode === this.menuInfo.chiefAssigned.employeeCode
    ) {
      this.subscribeAssignedTable(table);
      this.isHideTableGroupSelection = true;
      return;
    } else if (
      this.menuInfo.chiefAssigned &&
      this.chief.employeeCode !== this.menuInfo.chiefAssigned.employeeCode
    ) {
      content =
        dialogMessage.ORDER_TAKE_OVER_CONFIRM_FIRST_HALF +
        this.menuInfo.chiefAssigned.name +
        dialogMessage.ORDER_TAKE_OVER_CONFIRM_LAST_HALF;
    }

    const ref = this.modalService.open(ConfirmDialogComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });
    ref.componentInstance.title = title;
    ref.componentInstance.content = content;

    ref.result.then((confirmResult) => {
      if (confirmResult) {
        this.spinner.show();
        this.selectedOrder = this.menuInfo;

        this.selectedOrder.chiefAssigned = this.chief;

        this.firebaseService
          .assignChief(this.selectedOrder)
          .subscribe((result) => {
            this.spinner.hide();
            if (!result) {
              this.toastr.error(
                messageContent.ASSIGN_CHIEF_FAILED,
                messageTitle.FAILED
              );
              return;
            }

            this.toastr.success(
              messageContent.ASSIGN_CHIEF_SUCCESS,
              messageTitle.SUCCESS
            );
            this.subscribeAssignedTable(table);
          });

        this.isHideTableGroupSelection = true;
      }
    });
  }

  isTableSelected() {
    return this.selectedOrder;
  }

  subscribeAssignedTable(table: TableModel) {
    this.spinner.show();
    this.firebaseService.getSelectedOrder(table).subscribe((order) => {
      this.spinner.hide();
      if (!order) {
        this.toastr.error(
          messageContent.GET_SELECTED_ORDER_FAILED,
          messageTitle.FAILED
        );
        return;
      }

      this.selectedOrder = order;
    });
  }

  onClickNotStartedQuantity(item: OrderFoodMenu) {
    if (item.cookStatus === CookStatus.Cooking) {
      return;
    }
    const index = this.selectedOrder.orderItems.findIndex(
      (x) => x.id === item.id
    );
    if (index === -1) {
      return;
    }
    if (this.selectedOrder.orderItems[index].quantityInCooking > 0) {
      this.selectedOrder.orderItems[index].quantityNotStarted++;
      this.selectedOrder.orderItems[index].quantityInCooking--;
    }
  }

  onClickInCookingQuantity(item: OrderFoodMenu) {
    if (item.cookStatus === CookStatus.Cooking) {
      return;
    }
    const index = this.selectedOrder.orderItems.findIndex(
      (x) => x.id === item.id
    );
    if (index === -1) {
      return;
    }
    if (this.selectedOrder.orderItems[index].quantityNotStarted > 0) {
      this.selectedOrder.orderItems[index].quantityInCooking++;
      this.selectedOrder.orderItems[index].quantityNotStarted--;
    }
  }

  onClickStartCooking(item: OrderFoodMenu, index: number) {
    const tableId = this.selectedOrder.table.id;
    this.spinner.show();
    this.firebaseService.updateOrderStatus(tableId, OrderStatus.InProgress).subscribe(result => {
      this.spinner.hide();
      if (!result) {
        this.toastr.error(
          messageContent.UPDATE_QUANTITY_FAILED,
          messageTitle.FAILED
        );
        return;
      }

      this.toastr.success(
        messageContent.UPDATE_QUANTITY_SUCCESS,
        messageTitle.SUCCESS
      );
    });

    item.cookStatus = CookStatus.Cooking;
    this.spinner.show();
    this.firebaseService
      .updateCookingProgress(item, tableId, index)
      .subscribe((result) => {
        this.spinner.hide();
        if (!result) {
          this.toastr.error(
            messageContent.UPDATE_QUANTITY_FAILED,
            messageTitle.FAILED
          );
          return;
        }

        this.toastr.success(
          messageContent.UPDATE_QUANTITY_SUCCESS,
          messageTitle.SUCCESS
        );
      });
  }

  onClickDoneCooking(item: OrderFoodMenu, doneQuantity: number, index: number) {
    const tableId = this.selectedOrder.table.id;

    item.quantityHasBeenDone = item.quantityHasBeenDone + doneQuantity;
    item.quantityInCooking = item.quantityInCooking - doneQuantity;
    if (item.quantityNotStarted === 0 && item.quantityInCooking === 0) {
      item.cookStatus = CookStatus.Done;
    } else {
      item.cookStatus = CookStatus.NotDone;
    }

    this.spinner.hide();
    this.firebaseService
      .updateCookingProgress(item, tableId, index)
      .subscribe((result) => {
        this.spinner.hide();
        if (!result) {
          this.toastr.error(
            messageContent.UPDATE_QUANTITY_FAILED,
            messageTitle.FAILED
          );
          return;
        }

        this.toastr.success(
          messageContent.UPDATE_QUANTITY_SUCCESS,
          messageTitle.SUCCESS
        );
      });
  }
}
