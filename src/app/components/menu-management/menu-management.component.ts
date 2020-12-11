import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { dialogMessage, dialogTitle, messageContent, messageTitle } from 'src/app/constant/message.constant';
import { ConfirmDialogComponent } from 'src/app/dialog/confirm-dialog/confirm-dialog.component';
import { FoodMenu } from 'src/app/models/order-food.model';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: "app-menu-management",
  templateUrl: "./menu-management.component.html",
  styleUrls: ["./menu-management.component.scss"],
})
export class MenuManagementComponent implements OnInit {
  foodMenus: FoodMenu[] = [];
  foodMenusFiltered: FoodMenu[] = [];
  foodMenusForView: FoodMenu[] = [];

  searchText: string = '';

  totalPage: number;
  pageIndex: number = 0;
  pageSize: number = 5;

  selectedFood: FoodMenu;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getMenuList();
  }

  getMenuList() {
    this.spinner.show();
    this.firebaseService.getAllFoodMenu().subscribe((foodMenus: FoodMenu[]) => {
      this.spinner.hide();
      if (foodMenus.length) {
        this.foodMenus = foodMenus;
        this.foodMenusForView = this.foodMenus;
        this.calculateDataAndPaging();
        this.totalPage = this.foodMenus.length;
      }
    });
  }

  onSelectedFood(foodMenu: FoodMenu) {
    this.selectedFood = foodMenu;
  }

  activateClass(foodMenu: FoodMenu) {
    if (!this.selectedFood) {
      return false;
    }

    if (this.selectedFood.id === foodMenu.id) {
      return true;
    }

    return false;
  }

  onModifyBtnClick(isAddForm: boolean = false) {
    if (isAddForm) {
      this.router.navigate(["/menu-management/modify"], {
        queryParams: { id: null },
      });
    } else {
      this.router.navigate(["/menu-management/modify"], {
        queryParams: { id: this.selectedFood.id },
      });
    }
  }

  onDeleteBtnClick() {
    const title = dialogTitle.DELETE_FOOD_CONFIRM;
    const content = dialogMessage.DELETE_FOOD_CONFIRM + ` ${this.selectedFood.name}?`;

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
        this.firebaseService.deleteFoodMenu(this.selectedFood.id).subscribe((result) => {
          this.spinner.hide();
          if (result) {
            this.toastr.success(
              messageContent.FOOD_DELETE_SUCCESS,
              messageTitle.SUCCESS
            );
            this.selectedFood = null;
            this.getMenuList();
          } else {
            this.toastr.error(
              messageContent.FOOD_DELETE_FAILED,
              messageTitle.FAILED
            );
            return;
          }
        });
      }
    });
  }

  onChangeSelectedPage(pageIndex: number) {
    this.pageIndex += pageIndex;
    this.calculateDataAndPaging();
  }

  onSearchChange(searchString: string) {
    this.searchText = searchString;
    if (searchString) {
      this.foodMenusFiltered = this.foodMenus.filter(x => x.name.toLowerCase().includes(this.searchText.toLowerCase()));
    }
    
    this.calculateDataAndPaging();
  }

  calculateDataAndPaging() {
    const start = this.pageIndex * this.pageSize;
    const end = ((this.pageIndex + 1) * this.pageSize);

    if (this.searchText) {
      this.foodMenusForView = this.foodMenusFiltered.slice(start, end);
      console.log(this.foodMenusForView);
    } else {
      this.foodMenusForView = this.foodMenus.slice(start, end);
    }

    this.selectedFood = null;
  }

  onDisabledNextBtn(): boolean {
    if (this.searchText) {
      if ((this.pageIndex + 1) * this.pageSize >= this.foodMenusFiltered.length) {
        return true;
      }
    } else {
      if ((this.pageIndex + 1) * this.pageSize >= this.foodMenus.length) {
        return true;
      }
    }

     return false;
  }
}