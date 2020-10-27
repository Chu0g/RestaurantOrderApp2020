import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { Observable } from "rxjs";
import { FirebaseKey } from "../constant/firebase.constant";

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  constructor(private dbContext: AngularFireDatabase) {}

  login(username: string, authenRef: string): Observable<boolean> {
    return new Observable((observer) => {
      this.dbContext
        .list("/app/accounts", (ref) =>
          ref.orderByChild(FirebaseKey.AUTHEN_REF).equalTo(authenRef)
        )
        .snapshotChanges()
        .subscribe((snapshot: any) => {
          console.log(snapshot);
          if (!snapshot.length || snapshot.length > 1) {
            observer.next(false);
            observer.complete;
          }

          if (snapshot[0].key === username) {
            observer.next(true);
            observer.complete;
          }
        });
    });
  }
}
