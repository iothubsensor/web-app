import {SensorDTO} from "./sensor";
import {ActiveTab} from "../utils/global";

export class UserDTO {
  userId: number;
  email: string;
  role: Role;
  phoneExtension: string;
  phoneNumber: string;
  address: string;
  jobDescription: string;
  isSetup: boolean;
  token: string | undefined;
  screen: ActiveTab;
  sensors?: Array<String>;

  constructor(userId: number, email: string, role: Role, screen: ActiveTab, token: string, phoneExtension: string, phoneNumber: string, address: string, jobDescription: string, isSetup: boolean, sensors: Array<String>) {
    this.userId = userId;
    this.email = email;
    this.role = role;
    this.phoneExtension = phoneExtension;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.jobDescription = jobDescription;
    this.isSetup = isSetup;
    this.token = token;
    this.screen = screen;
    this.sensors = sensors;
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
