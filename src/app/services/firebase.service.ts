import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { FirebaseKey } from '../constant/firebase.constant';
import { OrderFoodMenu, OrderFoodModel } from '../models/order-food.model';
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

  getUnavailableTables(): Observable<TableModel[]> {
    return new Observable((observer) => {
      this.dbContext
        .list('/app/tables', (ref) =>
          ref.orderByChild(FirebaseKey.STATUS).equalTo(TableStatus.Unavailable)
        )
        .valueChanges()
        .subscribe((tables: TableModel[]) => {
          observer.next(tables);
          observer.complete();
        });
    });
  }

  getPendingOrder(tableId: string): Observable<OrderFoodModel> {
    return new Observable((observer) => {
      this.dbContext
        .list('/app/pendingOrders', (ref) =>
          ref.orderByChild(FirebaseKey.TABLE_ID).equalTo(tableId)
        )
        .valueChanges()
        .subscribe((pendingOrder: OrderFoodModel[]) => {
          if (pendingOrder.length > 0) {
            observer.next(pendingOrder[0]);
            observer.complete();
          } else {
            observer.next(null);
            observer.complete();
          }
        });
    });
  }

  getFoodMenu(): Observable<OrderFoodMenu[]> {
    return new Observable((observer) => {
      this.dbContext
        .list('/app/menu')
        .valueChanges()
        .subscribe((menu: OrderFoodMenu[]) => {
          if (menu.length > 0) {
            observer.next(menu);
            observer.complete();
          } else {
            observer.next(null);
            observer.complete();
          }
        });
    });
  }

  createPendingOrder(pendingOrder: OrderFoodModel): Observable<boolean> {
    return new Observable((observer) => {
      const itemsRef = this.dbContext.list('app/pendingOrders');
      itemsRef
        .set(`table_${pendingOrder.table.id}`, pendingOrder)
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

  updatePendingOrder(pendingOrder: OrderFoodModel): Observable<boolean> {
    return new Observable((observer) => {
      this.dbContext
        .list(`app/pendingOrders`)
        .push(pendingOrder)
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
