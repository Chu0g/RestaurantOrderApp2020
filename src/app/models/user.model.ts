export interface User {
  employeeCode: string;
  identityCardCode: string;
  name: string;
  role: UserRole;
  username: string;
}

export enum UserRole {
  Manager = 0,
  Chief = 1,
  Waiter = 2,
}
