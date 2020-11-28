import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  messageContent,
  messageTitle,
} from "src/app/constant/message.constant";
import { Gender, User, UserRole } from "src/app/models/user.model";
import { FirebaseService } from "src/app/services/firebase.service";

@Component({
  selector: "account-modify-form",
  templateUrl: "./account-modify-form.component.html",
  styleUrls: ["./account-modify-form.component.scss"],
})
export class AccountModifyFormComponent implements OnInit {
  title: string = "";

  selectedIdentityCardCode: number;
  selectedDate: Date;
  isEditMode: boolean = false;

  modifyForm = new FormGroup({
    username: new FormControl("", Validators.required),
    identityCardCode: new FormControl("", [
      Validators.pattern("^[0-9]*$"),
      Validators.required]),
    name: new FormControl("", Validators.required),
    gender: new FormControl("male", Validators.required),
    phoneNumber: new FormControl("", [
      Validators.pattern("^[0-9]*$"),
      Validators.required,
    ]),
    joinDate: new FormControl("", Validators.required),
    role: new FormControl("waiter", Validators.required),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params["identityCardCode"]) {
        this.isEditMode = true;
        this.selectedIdentityCardCode = Number(params["identityCardCode"]);
        this.title = "Sửa thông tin tài khoản";
        this.initDataInForm();
      } else {
        this.title = "Thêm thông tin tài khoản";
      }
    });
  }

  onChangeUsername($event) {
    const usernameInput = this.modifyForm.get("username");
    if (usernameInput) {
      usernameInput.setValue($event);
    }
  }

  onChangeGender($event) {
    const genderInput = this.modifyForm.get("gender");
    if (genderInput) {
      genderInput.setValue($event);
    }
  }

  onChangeRole($event) {
    const roleInput = this.modifyForm.get("role");
    if (roleInput) {
      roleInput.setValue($event);
    }
  }

  onChangeJoinDate($event) {
    this.selectedDate = $event;
  }
  onChangeID($event) {
    const idInput = this.modifyForm.get("identityCardCode");
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

  onClickEditDate() {
    const dateInput = this.modifyForm.get("joinDate");
    this.selectedDate = null;
    dateInput.setValue("");
  }

  initDataInForm() {
    this.firebaseService
      .getUserInfoByIdentityCardCode(Number(this.selectedIdentityCardCode))
      .subscribe((userInfo) => {
        if (!userInfo) {
          this.toastr.error(
            messageContent.GET_USER_INFO_FAILED,
            messageTitle.FAILED
          );
          return;
        }

        this.fillInForm(userInfo);
      });
  }

  fillInForm(userInfo: User) {
    this.modifyForm.patchValue({
      username: userInfo.username,
      identityCardCode: userInfo.identityCardCode,
      name: userInfo.name,
      gender: userInfo.gender === Gender.Male ? "male" : "female",
      phoneNumber: userInfo.phoneNumber,
      joinDate: this.convertToDateValue(userInfo.joinDate),
      role: userInfo.role === UserRole.Waiter ? "waiter" : "chief",
    });

    this.selectedDate = this.convertToDateValue(userInfo.joinDate);
  }

  convertToDateValue(joinDateString: string) {
    const dateSplit = joinDateString.split("/");
    const dateString = dateSplit[2] + "/" + dateSplit[1] + "/" + dateSplit[0];

    return new Date(dateString);
  }

  displayDateString() {
    if (!this.selectedDate) {
      return;
    }

    const dateModel = new Date(this.selectedDate);

    const dateString = dateModel.getDate() > 9 ? dateModel.getDate() : "0" + dateModel.getDate();

    const monthString = dateModel.getMonth() + 1 > 9 ? dateModel.getMonth() + 1 : "0" + (dateModel.getMonth() + 1);

    return (
      dateString +
      "/" +
      monthString  +
      "/" +
      dateModel.getFullYear()
    );
  }

  autoGeneratePassword(username: string) {
    return username + '_123456';
  }

  onClickSubmit() {
    const usernameInput = this.modifyForm.get("username").value;

    const userRequest: User = {
      username: usernameInput,
      identityCardCode: Number(this.modifyForm.get("identityCardCode").value),
      name: this.modifyForm.get("name").value,
      gender:
        this.modifyForm.get("gender").value === "male"
          ? Gender.Male
          : Gender.Female,
      joinDate: this.displayDateString(),
      phoneNumber: this.modifyForm.get("phoneNumber").value,
      role:
        this.modifyForm.get("role").value === "waiter"
          ? UserRole.Waiter
          : UserRole.Chief,
      authenRef: this.autoGeneratePassword(usernameInput)
    };

    if (!this.isEditMode) {
      this.firebaseService
      .checkIfUsernameExisted(usernameInput)
      .subscribe((isExist) => {
        if (isExist) {
          this.toastr.error(messageContent.USER_ALREADY_TAKEN, messageTitle.FAILED);
          return;
        }

        this.firebaseService.createUser(userRequest).subscribe(result => {
          if (!result) {
            this.toastr.error(messageContent.USER_ADDED_FAILED, messageTitle.FAILED);
            return;
          }
  
          this.toastr.success(messageContent.USER_ADDED_SUCCESS, messageTitle.SUCCESS);
          this.router.navigateByUrl("/acc-management");
        });
      });
    } else {
      this.firebaseService.updateUser(userRequest).subscribe(result => {
        if (!result) {
          this.toastr.error(messageContent.USER_UPDATED_FAILED, messageTitle.FAILED);
          return;
        }

        this.toastr.success(messageContent.USER_UPDATED_SUCCESS, messageTitle.SUCCESS);
        this.router.navigateByUrl("/acc-management");
      });
    }
  }
}
