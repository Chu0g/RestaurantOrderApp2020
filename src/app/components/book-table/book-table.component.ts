import { Component, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AppComponent } from "src/app/app.component";
import { CommonDialogComponent } from "src/app/dialog/common-dialog/common-dialog.component";
import { ConfirmDialogComponent } from "src/app/dialog/confirm-dialog/confirm-dialog.component";
import { TableModel, TableStatus } from "src/app/models/table.model";

@Component({
  selector: "app-book-table",
  templateUrl: "./book-table.component.html",
  styleUrls: ["./book-table.component.scss"],
})
export class BookTableComponent implements OnInit {
  @ViewChild(AppComponent) app: AppComponent;

  title = "Đặt bàn";

  tables: TableModel[] = [
    { id: "1", status: TableStatus.Available },
    { id: "2", status: TableStatus.Available },
    { id: "3", status: TableStatus.Unavailable },
    { id: "4", status: TableStatus.Available },
    { id: "5", status: TableStatus.Unavailable },
    { id: "6", status: TableStatus.Available },
    { id: "7", status: TableStatus.Unavailable },
    { id: "8", status: TableStatus.Available },
    { id: "9", status: TableStatus.Available },
    { id: "10", status: TableStatus.Unavailable },
  ];

  constructor(private titleService: Title, private modalService: NgbModal) {}

  ngOnInit() {
    this.titleService.setTitle(this.title.toLocaleUpperCase());
  }

  checkTableAvailable(tableStatus: TableStatus) {
    return tableStatus === TableStatus.Available;
  }

  checkTableUnavailable(tableStatus: TableStatus) {
    return tableStatus === TableStatus.Unavailable;
  }

  onClickBook(table: TableModel, index: number) {
    if (table.status !== TableStatus.Available) {
      return;
    }
    const title = `Đặt bàn số ${table.id}?`;
    const content = `Bàn số ${table.id} đang trống, xác nhận đặt bàn này?`;

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
        const content = `Đặt bàn thành công! Đã có thể đặt món tại bàn này.`;
        const commonRef = this.modalService.open(CommonDialogComponent, {
          size: "lg",
          centered: true,
          backdrop: "static",
        });
        commonRef.componentInstance.title = alertTitle;
        commonRef.componentInstance.content = content;
        this.tables[index].status = TableStatus.Unavailable;
      }
    });
  }
}
