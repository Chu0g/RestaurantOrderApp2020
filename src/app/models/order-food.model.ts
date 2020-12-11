import { CookStatus, OrderStatus } from '../enums/order-food.enum';
import { TableModel } from './table.model';
import { User } from './user.model';

export interface FoodMenu {
  id: string;
  name: string;
  price: number;
}

export interface OrderFoodMenu {
  id: string;
  name: string;
  price: number;
  quantityNotStarted: number;
  quantityInCooking: number;
  quantityHasBeenDone: number;
  cookStatus: CookStatus;
}

export interface OrderFoodModel {
  table: TableModel;
  chiefAssigned: User;
  orderStatus: OrderStatus;
  orderItems: OrderFoodMenu[];
}

export interface PaidOrderFoodModel {
  orderCode: string;
  tableId: string;
  chiefAssignedId: number;
  createdDate: string;
  total: number;
  monthRef: string;
}
