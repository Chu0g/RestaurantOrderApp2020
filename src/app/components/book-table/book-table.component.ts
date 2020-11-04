import { Component, OnInit, Output, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { AppComponent } from "src/app/app.component";
import {
  dialogMessage,
  dialogTitle,
  messageContent,
  messageTitle,
  spinnerContent,
} from "src/app/constant/message.constant";
import { ConfirmDialogComponent } from "src/app/dialog/confirm-dialog/confirm-dialog.component";
import { TableModel, TableStatus } from "src/app/models/table.model";
import { FirebaseService } from "src/app/services/firebase.service";

@Component({
  selector: "app-book-table",
  templateUrl: "./book-table.component.html",
  styleUrls: ["./book-table.component.scss"],
})
export class BookTableComponent implements OnInit {
  @ViewChild(AppComponent) app: AppComponent;

  title = "Đặt bàn";
  tables: TableModel[] = [];
  tableSub: Subscription;

  successSelectedTable: TableModel = null;

  timeLeft = 4;

  spinnerFirstHalf = spinnerContent.NAVIGATE_CONTENT_FIRST_HALF;
  spinnerLastHalf = spinnerContent.NAVIGATE_CONTENT_LAST_HALF;

  constructor(
    private titleService: Title,
    private modalService: NgbModal,
    private firebaseService: FirebaseService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getTableList();
    this.titleService.setTitle(this.title.toLocaleUpperCase());
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy(): void {
    if (this.tableSub) {
      this.tableSub.unsubscribe();
    }
  }

  checkTableAvailable(tableStatus: TableStatus) {
    return tableStatus === TableStatus.Available;
  }

  checkTableUnavailable(tableStatus: TableStatus) {
    return tableStatus === TableStatus.Unavailable;
  }

  getTableList() {
    this.spinner.show();
    this.tableSub = this.firebaseService
      .getAllTableList()
      .subscribe((tables: TableModel[]) => {
        this.spinner.hide();
        if (tables) {
          this.tables = tables;
        }
      });
  }

  onClickBook(table: TableModel) {
    if (table.status !== TableStatus.Available) {
      const errorMessage =
        messageContent.BOOK_TABLE_ALREADY_TAKEN_FIRST_HALF +
        table.id +
        messageContent.BOOK_TABLE_ALREADY_TAKEN_LAST_HALF;

      this.toastr.error(errorMessage, messageTitle.FAILED);
      return;
    }
    const title =
      dialogTitle.BOOK_TABLE_CONFIRM_FIRST_HALF +
      table.id +
      dialogTitle.BOOK_TABLE_CONFIRM_LAST_HALF;
    const content =
      dialogMessage.BOOK_TABLE_CONFIRM_FIRST_HALF +
      table.id +
      dialogMessage.BOOK_TABLE_CONFIRM_LAST_HALF;

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
        this.firebaseService.bookTable(table).subscribe((result) => {
          this.spinner.hide();
          if (result) {
            this.successSelectedTable = table;
            this.toastr.success(
              messageContent.BOOK_TABLE_SUCCESS,
              messageTitle.SUCCESS
            );
            this.onShowSpinnerToCountDown();
          } else {
            this.toastr.success(
              messageContent.BOOK_TABLE_FAILED,
              messageTitle.FAILED
            );
          }
        });
      }
    });
  }

  onShowSpinnerToCountDown() {
    this.spinner.show("navigate-spinner");
    var downloadTimer = setInterval(() => {
      if (this.timeLeft <= 1) {
        clearInterval(downloadTimer);
        this.router.navigateByUrl(`/order`);
      }
      this.timeLeft -= 1;
    }, 1000);
  }
}
