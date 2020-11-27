export interface User {
  identityCardCode: string;
  name: string;
  role: UserRole;
  username: string;
  joinDate: string;
  gender: Gender;
  phoneNumber: string;
  authenRef: string;
}

export enum UserRole {
  Manager = 0,
  Chief = 1,
  Waiter = 2,
}

export enum Gender {
  Female = 0,
  Male = 1
}