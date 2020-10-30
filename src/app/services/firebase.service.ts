import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { FirebaseKey } from '../constant/firebase.constant';
import { TableModel, TableStatus } from '../models/table.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private dbContext: AngularFireDatabase) {}

  login(username: string, authenRef: string): Observable<boolean> {
    return new Observable((observer) => {
      this.dbContext
        .list('/app/accounts', (ref) =>
          ref.orderByChild(FirebaseKey.AUTHEN_REF).equalTo(authenRef)
        )
        .snapshotChanges()
        .subscribe((snapshot: any) => {
          if (!snapshot.length || snapshot.length > 1) {
            observer.next(false);
            observer.complete();
          }

          if (snapshot[0].key === username) {
            observer.next(true);
            observer.complete();
          }
        });
    });
  }

  getUserInfo(authenRef: string): Observable<User> {
    return new Observable((observer) => {
      this.dbContext
        .list('/app/accounts', (ref) =>
          ref.orderByChild(FirebaseKey.AUTHEN_REF).equalTo(authenRef)
        )
        .valueChanges()
        .subscribe((user: User[]) => {
          if (user.length) {
            observer.next(user[0]);
            observer.complete();
          } else {
            observer.next(null);
            observer.complete();
          }
        });
    });
  }

  getAllTableList(): Observable<TableModel[]> {
    return new Observable((observer) => {
      this.dbContext
        .list('/app/tables')
        .valueChanges()
        .subscribe((tables: TableModel[]) => {
          if (tables.length) {
            observer.next(tables);
          } else {
            observer.next(null);
          }
        });
    });
  }

  bookTable(table: TableModel): Observable<boolean> {
    return new Observable((observer) => {
      this.dbContext
        .object(`/app/tables/${'table' + table.id}`)
        .update({
          status: TableStatus.Unavailable,
        })
        .then(() => {
          observer.next(true);
          observer.complete();
        })
        .catch((error) => {
          observer.next(false);
          observer.complete();
        });
    });
  }
}
