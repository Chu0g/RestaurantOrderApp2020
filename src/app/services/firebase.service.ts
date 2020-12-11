import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { Observable } from "rxjs";
import { FirebaseKey } from "../constant/firebase.constant";
import { OrderStatus } from "../enums/order-food.enum";
import {
  FoodMenu,
  OrderFoodMenu,
  OrderFoodModel,
  PaidOrderFoodModel,
} from "../models/order-food.model";
import { TableModel, TableStatus } from "../models/table.model";
import { User } from "../models/user.model";

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

  getUserInfoByAuthRef(authenRef: string): Observable<User> {
    return new Observable((observer) => {
      this.dbContext
        .list("/app/accounts", (ref) =>
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

  getUserInfoByIdentityCardCode(identityCardCode: number): Observable<User> {
    return new Observable((observer) => {
      this.dbContext
        .list("/app/accounts", (ref) =>
          ref
            .orderByChild(FirebaseKey.IDENTITY_CARD_CODE)
            .equalTo(identityCardCode)
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

  getAllUsers(): Observable<User[]> {
    return new Observable((observer) => {
      this.dbContext
        .list("/app/accounts")
        .valueChanges()
        .subscribe((users: User[]) => {
          if (users.length) {
            observer.next(users);
            observer.complete();
          } else {
            observer.next([]);
            observer.complete();
          }
        });
    });
  }

  getFoodMenuById(id: string): Observable<FoodMenu> {
    return new Observable((observer) => {
      this.dbContext
        .list("/app/menus", (ref) =>
          ref.orderByChild(FirebaseKey.ID).equalTo(id)
        )
        .valueChanges()
        .subscribe((menus: FoodMenu[]) => {
          if (menus.length) {
            observer.next(menus[0]);
            observer.complete();
          } else {
            observer.next(null);
            observer.complete();
          }
        });
    });
  }

  getAllFoodMenu(): Observable<FoodMenu[]> {
    return new Observable((observer) => {
      this.dbContext
        .list("/app/menus")
        .valueChanges()
        .subscribe((menus: FoodMenu[]) => {
          if (menus.length) {
            observer.next(menus);
            observer.complete();
          } else {
            observer.next([]);
            observer.complete();
          }
        });
    });
  }

  getAllTableList(): Observable<TableModel[]> {
    return new Observable((observer) => {
      this.dbContext
        .list("/app/tables")
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
        .object(`/app/tables/${"table" + table.id}`)
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
        .list("/app/tables", (ref) =>
          ref.orderByChild(FirebaseKey.STATUS).equalTo(TableStatus.Unavailable)
        )
        .valueChanges()
        .subscribe((tables: TableModel[]) => {
          observer.next(tables);
          observer.complete();
        });
    });
  }

  getPendingOrder(tableCode: string): Observable<OrderFoodModel> {
    return new Observable((observer) => {
      this.dbContext
        .list("/app/pendingOrders", (ref) =>
          ref.orderByChild(FirebaseKey.TABLE_CODE).equalTo(tableCode)
        )
        .valueChanges()
        .subscribe((pendingOrder: OrderFoodModel[]) => {
          if (pendingOrder.length > 0) {
            observer.next(pendingOrder[0]);
          } else {
            observer.next(null);
          }
        });
    });
  }

  getFoodMenu(): Observable<OrderFoodMenu[]> {
    return new Observable((observer) => {
      this.dbContext
        .list("/app/menus")
        .valueChanges()
        .subscribe((menu: any[]) => {
          if (menu.length > 0) {
            observer.next(menu);
          } else {
            observer.next(null);
          }
        });
    });
  }

  createPendingOrder(pendingOrder: OrderFoodModel): Observable<boolean> {
    return new Observable((observer) => {
      const itemsRef = this.dbContext.list("app/pendingOrders");
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

  updatePendingOrder(
    updatedMenu: OrderFoodMenu[],
    tableId: string
  ): Observable<boolean> {
    return new Observable((observer) => {
      const ref = this.dbContext.list(
        `app/pendingOrders/${"table_" + tableId}`
      );
      ref
        .remove("orderItems")
        .then(() => {
          observer.next(true);
          observer.complete();
          ref
            .set("orderItems", updatedMenu)
            .then(() => {
              observer.next(true);
              observer.complete();
            })
            .catch((error) => {
              observer.next(false);
              observer.complete();
            });
        })
        .catch((error) => {
          observer.next(false);
          observer.complete();
        });
    });
  }

  getOrderedTable(): Observable<OrderFoodModel[]> {
    return new Observable((observer) => {
      this.dbContext
        .list(`app/pendingOrders`)
        .valueChanges()
        .subscribe((orderedTables: OrderFoodModel[]) => {
          if (orderedTables.length) {
            observer.next(orderedTables);
          } else {
            observer.next(null);
          }
        });
    });
  }

  assignChief(order: OrderFoodModel): Observable<boolean> {
    return new Observable((observer) => {
      this.dbContext
        .object(`app/pendingOrders/${"table_" + order.table.id}`)
        .update({
          chiefAssigned: order.chiefAssigned,
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

  getSelectedOrder(table: TableModel): Observable<OrderFoodModel> {
    return new Observable((observer) => {
      this.dbContext
        .object(`app/pendingOrders/${"table_" + table.id}`)
        .valueChanges()
        .subscribe((order: OrderFoodModel) => {
          if (order) {
            observer.next(order);
          } else {
            observer.next(null);
          }
        });
    });
  }

  updateOrderStatus(
    tableId: string,
    updatedOrderStatus: OrderStatus
  ): Observable<boolean> {
    return new Observable((observer) => {
      this.dbContext
        .object(`app/pendingOrders/${"table_" + tableId}`)
        .update({
          orderStatus: updatedOrderStatus,
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

  updateCookingProgress(
    currentOrder: OrderFoodMenu,
    tableId: string,
    index: number
  ): Observable<boolean> {
    return new Observable((observer) => {
      this.dbContext
        .list(`app/pendingOrders/${"table_" + tableId}/orderItems`, (ref) =>
          ref.orderByChild(FirebaseKey.ID).equalTo(currentOrder.id)
        )
        .update(`${index}`, {
          cookStatus: currentOrder.cookStatus,
          quantityNotStarted: currentOrder.quantityNotStarted,
          quantityInCooking: currentOrder.quantityInCooking,
          quantityHasBeenDone: currentOrder.quantityHasBeenDone,
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

  getUserList(): Observable<User[]> {
    return new Observable((observer) => {
      this.dbContext
        .list(`app/accounts`)
        .valueChanges()
        .subscribe((users: User[]) => {
          if (users.length) {
            observer.next(users);
            observer.complete();
          }
        });
    });
  }

  checkIfUsernameExisted(username: string): Observable<boolean> {
    return new Observable((observer) => {
      this.dbContext
        .list("/app/accounts", (ref) =>
          ref.orderByChild(FirebaseKey.USERNAME).equalTo(username)
        )
        .snapshotChanges()
        .subscribe((snapshot: any) => {
          if (!snapshot.length || snapshot.length > 1) {
            observer.next(false);
            observer.complete();
          }

          if (snapshot[0] && snapshot[0].key === username) {
            observer.next(true);
            observer.complete();
          }
        });
    });
  }

  checkIfFoodIdExisted(id: string): Observable<boolean> {
    return new Observable((observer) => {
      this.dbContext
        .list("/app/menus", (ref) =>
          ref.orderByChild(FirebaseKey.ID).equalTo(id)
        )
        .snapshotChanges()
        .subscribe((snapshot: any) => {
          if (!snapshot.length || snapshot.length > 1) {
            observer.next(false);
            observer.complete();
          }

          if (snapshot[0] && snapshot[0].key === id) {
            observer.next(true);
            observer.complete();
          }
        });
    });
  }

  createUser(userInfo: User): Observable<boolean> {
    return new Observable((observer) => {
      const ref = this.dbContext.list("app/accounts");
      ref
        .set(`${userInfo.username}`, userInfo)
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

  updateUser(userInfo: User): Observable<boolean> {
    return new Observable((observer) => {
      this.dbContext
        .list(`app/accounts/`, (ref) =>
          ref.orderByChild(FirebaseKey.USERNAME).equalTo(userInfo.username)
        )
        .update(`${userInfo.username}`, {
          identityCardCode: userInfo.identityCardCode,
          name: userInfo.name,
          gender: userInfo.gender,
          phoneNumber: userInfo.phoneNumber,
          joinDate: userInfo.joinDate,
          role: userInfo.role,
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

  deleteUser(username: string): Observable<boolean> {
    return new Observable((observer) => {
      const ref = this.dbContext.list(`app/accounts/`);

      ref
        .remove(`${username}`)
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

  createFoodMenu(menuInfo: FoodMenu): Observable<boolean> {
    return new Observable((observer) => {
      const ref = this.dbContext.list("app/menus");
      ref
        .set(`food${menuInfo.id}`, menuInfo)
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

  updateFoodMenu(menuInfo: FoodMenu): Observable<boolean> {
    return new Observable((observer) => {
      this.dbContext
        .list(`app/menus/`, (ref) =>
          ref.orderByChild(FirebaseKey.ID).equalTo(menuInfo.id)
        )
        .update(`food${menuInfo.id}`, {
          name: menuInfo.name,
          price: menuInfo.price,
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

  deleteFoodMenu(foodId: string): Observable<boolean> {
    return new Observable((observer) => {
      const ref = this.dbContext.list(`app/menus/`);

      ref
        .remove(`food${foodId}`)
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

  getDonePendingOrder(): Observable<OrderFoodModel[]> {
    return new Observable((observer) => {
      this.dbContext
        .list(`app/pendingOrders/`, (ref) =>
          ref
            .orderByChild(FirebaseKey.ORDER_STATUS)
            .equalTo(OrderStatus.DoneAll)
        )
        .valueChanges()
        .subscribe((orders: OrderFoodModel[]) => {
          if (orders.length) {
            observer.next(orders);
          } else {
            observer.next([]);
          }
        });
    });
  }

  createPaidOrder(paidOrderRequest: PaidOrderFoodModel): Observable<boolean> {
    return new Observable((observer) => {
      const paidOrdersRef = this.dbContext.list("app/paidOrders");

      paidOrdersRef
        .set(`${paidOrderRequest.orderCode}`, paidOrderRequest)
        .then(() => {
          const pendingOrderRef = this.dbContext
            .list("app/pendingOrders")
            .remove(`${"table_" + paidOrderRequest.tableId}`)
            .then(() => {
              this.dbContext
                .object(`/app/tables/${"table" + paidOrderRequest.tableId}`)
                .update({
                  status: TableStatus.Available,
                })
                .then(() => {
                  observer.next(true);
                  observer.complete();
                })
                .catch((error) => {
                  observer.next(false);
                  observer.complete();
                });
            })
            .catch((error) => {
              observer.next(false);
              observer.complete();
            });
        })
        .catch((error) => {
          observer.next(false);
          observer.complete();
        });
    });
  }

  getPaidOrderList(monthRef: string): Observable<PaidOrderFoodModel[]> {
    return new Observable((obsever) => {
      this.dbContext
      .list("app/paidOrders", (ref) => 
        ref.orderByChild(FirebaseKey.MONTH_REF).equalTo(monthRef)
      )
      .valueChanges()
      .subscribe((paidOrder: PaidOrderFoodModel[]) => {
        if (paidOrder.length) {
          obsever.next(paidOrder);
          obsever.complete();
        } else {
          obsever.next([]);
          obsever.complete();
        }
      });
    });
  }
}
