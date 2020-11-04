import { TableModel } from './table.model';
import { User } from './user.model';

export interface OrderFoodMenu {
  id: string;
  name: string;
  price: number;
  quantity: number;
  foodStatus: FoodStatus;
}

export interface OrderFoodModel {
  table: TableModel;
  chiefAssigned: User;
  orderItems: OrderFoodMenu[];
}

export enum FoodStatus {
  NotStarted = 0,
  Cooking = 1,
  Done = 2
}
