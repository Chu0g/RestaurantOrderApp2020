import { CookStatus, OrderStatus } from '../enums/order-food.enum';
import { TableModel } from './table.model';
import { User } from './user.model';

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
