import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  messageContent,
  messageTitle,
} from "src/app/constant/message.constant";
import { FoodMenu } from 'src/app/models/order-food.model';
import { FirebaseService } from "src/app/services/firebase.service";

@Component({
  selector: "menu-modify-form",
  templateUrl: "./menu-modify-form.component.html",
  styleUrls: ["./menu-modify-form.component.scss"],
})
export class MenuModifyFormComponent implements OnInit {
  title: string = "";
  isEditMode: boolean = false;

  selectedFoodId: string;

  modifyForm = new FormGroup({
    id: new FormControl("", [
      Validators.pattern("^[0-9]*$"),
      Validators.required]),
    name: new FormControl("", Validators.required),
    price: new FormControl("", [
      Validators.pattern("^[0-9]*$"),
      Validators.required,
    ])
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.selectedFoodId = params["id"];
        this.title = "Sửa thông tin món ăn";
        this.initDataInForm();
      } else {
        this.title = "Thêm món ăn";
      }
    });
  }

  onChangeID($event) {
    const idInput = this.modifyForm.get("id");
    if (idInput) {
      idInput.setValue($event);
    }
  }

  onChangeName($event) {
    const nameInput = this.modifyForm.get("name");
    if (nameInput) {
      nameInput.setValue($event);
    }
  }

  onChangePrice($event) {
    const priceInput = this.modifyForm.get("price");
    if (priceInput) {
      priceInput.setValue($event);
    }
  }

  initDataInForm() {
    this.firebaseService
      .getFoodMenuById(this.selectedFoodId)
      .subscribe((foodMenuInfo) => {
        if (!foodMenuInfo) {
          this.toastr.error(
            messageContent.GET_FOOD_INFO_FAILED,
            messageTitle.FAILED
          );
          return;
        }

        this.fillInForm(foodMenuInfo);
      });
  }

  fillInForm(foodMenu: FoodMenu) {
    this.modifyForm.patchValue({
      id: foodMenu.id,
      name: foodMenu.name,
      price: foodMenu.price,
    });
  }

  convertToDateValue(joinDateString: string) {
    const dateSplit = joinDateString.split("/");
    const dateString = dateSplit[2] + "/" + dateSplit[1] + "/" + dateSplit[0];

    return new Date(dateString);
  }

  generatePassword(username: string, password: string) {
    return username + '_' + password;
  }

  onClickSubmit() {
    const idInput = this.modifyForm.get("id").value;

    const foodMenuRequest: FoodMenu = {
      id: this.modifyForm.get("id").value,
      name: this.modifyForm.get("name").value,
      price: Number(this.modifyForm.get("price").value)
    };

    if (!this.isEditMode) {
      this.firebaseService
      .checkIfFoodIdExisted(idInput)
      .subscribe((isExist) => {
        if (isExist) {
          this.toastr.error(messageContent.ID_ALREADY_TAKEN, messageTitle.FAILED);
          return;
        }

        this.firebaseService.createFoodMenu(foodMenuRequest).subscribe(result => {
          if (!result) {
            this.toastr.error(messageContent.USER_ADDED_FAILED, messageTitle.FAILED);
            return;
          }
  
          this.toastr.success(messageContent.USER_ADDED_SUCCESS, messageTitle.SUCCESS);
          this.router.navigateByUrl("/menu-management");
        });
      });
    } else {
      this.firebaseService.updateFoodMenu(foodMenuRequest).subscribe(result => {
        if (!result) {
          this.toastr.error(messageContent.UPDATED_FAILED, messageTitle.FAILED);
          return;
        }

        this.toastr.success(messageContent.UPDATED_SUCCESS, messageTitle.SUCCESS);
        this.router.navigateByUrl("/menu-management");
      });
    }
  }
}
