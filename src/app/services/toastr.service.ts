import { Injectable } from "@angular/core";
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: "root",
})
export class ToastrAppService {
  constructor(private toastr: ToastrService) {}

  success(title: string, content: string) {
    this.toastr.success(content, title, {
        timeOut: 2000,
        tapToDismiss: true,
        positionClass: 'toast-bottom-full-width'
    })
  }

  error(title: string, content: string) {
    this.toastr.error(content, title, {
        timeOut: 2000,
        tapToDismiss: true,
        positionClass: 'toast-bottom-full-width'
    })
  }

  warning(title: string, content: string) {
    this.toastr.warning(title, content, {
        timeOut: 2000,
        tapToDismiss: true,
        positionClass: 'toast-bottom-full-width'
    })
  }

  info(title: string, content: string) {
    this.toastr.info(content, title, {
        timeOut: 2000,
        tapToDismiss: true,
        positionClass: 'toast-bottom-full-width'
    })
  }
}
