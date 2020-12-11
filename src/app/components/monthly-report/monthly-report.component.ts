import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { PaidOrderFoodModel } from "src/app/models/order-food.model";
import { FirebaseService } from "src/app/services/firebase.service";

@Component({
  selector: "app-monthly-report",
  templateUrl: "./monthly-report.component.html",
  styleUrls: ["./monthly-report.component.scss"],
})
export class MonthlyReportComponent implements OnInit {
  reports: PaidOrderFoodModel[] = [];
  reportsForView: PaidOrderFoodModel[] = [];

  searchText: string = "";

  monthFilter: string;
  yearFilter: string;

  totalPage: number;
  pageIndex: number = 0;
  pageSize: number = 5;

  selectedOrder: PaidOrderFoodModel;

  constructor(
    private firebaseService: FirebaseService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit() {
    this.initMonthAndYearFilter();
    this.getPaidOrderList();
  }

  initMonthAndYearFilter() {
    const now = new Date();

    this.monthFilter =
      now.getMonth() + 1 > 9
        ? (now.getMonth() + 1).toString()
        : "0" + (now.getMonth() + 1);

    this.yearFilter = now.getFullYear().toString();
  }

  getPaidOrderList() {
    this.spinner.show();
    this.firebaseService.getPaidOrderList(this.getMonthRef()).subscribe((paidOrders: PaidOrderFoodModel[]) => {
        this.spinner.hide();
        this.reports = paidOrders;
        this.calculateDateAndPaging();
        this.totalPage = this.reports.length;
    });
  }

  getMonthRef(): string {
    return `${this.monthFilter}_${this.yearFilter}`;
  }

  onSelectedReport(order: PaidOrderFoodModel) {
    this.selectedOrder = order;
  }

  onChangeSelectedMonth(size: number): void {
    const result = Number(this.monthFilter) + size;
    this.monthFilter = result > 9 ? result.toString() : '0' + result;
    this.getPaidOrderList();
  }

  onChangeSelectedYear(size: number): void {
    const result = Number(this.yearFilter) + size;
    this.yearFilter = result > 9 ? result.toString() : '0' + result;
    this.getPaidOrderList();
  }

  onChangeSelectedPage(size: number): void {
    this.pageIndex += size;
    this.calculateDateAndPaging();
  }

  calculateDateAndPaging() {
    const start = this.pageIndex * this.pageSize;
    const end = (this.pageIndex + 1) * this.pageSize;

    this.reportsForView = this.reports.slice(start, end);

    this.selectedOrder = null;
  }

  calculateTotalPrice(): number {
    return this.reports.reduce((total, value) => total + value.total, 0);
  }

  activateClass(order: PaidOrderFoodModel) {
    if (!this.selectedOrder) {
      return false;
    }

    if (this.selectedOrder.orderCode === order.orderCode) {
      return true;
    }

    return false;
  }
}
