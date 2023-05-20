import {PlantDTO} from "./plant";
import {ActiveTab} from "../utils/global";

export class UserDTO {
  userId: number;
  admin: Boolean;
  email: string;
  token: string | undefined;
  screen: ActiveTab;
  plants?: Array<String>;

  constructor(userId: number, email: string, screen: ActiveTab, token: string, plants: Array<String>,admin: Boolean) {
    this.userId = userId;
    this.email = email;
    this.token = token;
    this.screen = screen;
    this.plants = plants;
    this.admin = admin;

  }

}

export enum Role {
  Customer = 0,
  Admin = 1
}

export class UserLoginRequestDto {
  email?: string;
  password?: string;

  isSetup?: boolean;

  firstName?: string;
  lastName?: string;

  address?: string;
  jobDescription?: string;

  phoneExtension?: string;
  phoneNumber?: string;

  constructor()
   {
    this.email = "";
    this.password = "";

    this.firstName = "";
    this.lastName = "";

    this.address = "";
    this.jobDescription = "";

    this.phoneExtension = "961";
    this.phoneNumber = "";
  }

}

export enum LoginState {
  INPUT_EMAIL,
  INPUT_PASSWORD,
  SETUP
}

export class SearchUserRequestDTO {
  page!: number;
  size!: number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  role?: string;
  active?: boolean;
}
