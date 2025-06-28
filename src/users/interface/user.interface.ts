import { UserRole, UserSource } from "src/common/interfaces/user.interface";

export interface IUser {
    id?: string;
    password?: string;
    email: string;
    name: string;
    picture: string;
    verified?: boolean;
    status?: string;
    firstName?: string;
    lastName?: string;
    roles: UserRole[];
    source: UserSource;
    googleData?: any;
    // permissions: Permissions[];
    lastLoggedIn?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }