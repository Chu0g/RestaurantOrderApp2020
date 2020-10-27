export interface TableModel {
  id: string;
  status: TableStatus;
}

export enum TableStatus {
  Available = 0,
  Unavailable = 1,
}
