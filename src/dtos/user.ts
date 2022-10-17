export class UserDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  phoneNumber?: number;
  phoneCode?: number;
  description?: string;
  address?: string;

  constructor(
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    role: Role
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
  }
}

export enum Role {
  admin = "admin",
  customer = "customer"
}

export class UserLoginRequestDto {
  email?: string;
  activeAccount?: boolean;

  password?: string;

  firstName?: string;
  lastName?: string;
  gender?: string;
  placeOfBirth?: string;
  nationality?: string;
  dateOfBirth?: Date;

  phoneExtension?: string;
  phoneNumber?: string;

  constructor()
   {
    this.email = "";
    this.password = "";

    this.firstName = "";
    this.lastName = "";
    this.gender = "";
    this.placeOfBirth = "";
    this.nationality = "";

    this.phoneExtension = "971";
    this.phoneNumber = "";
  }

}

export enum LoginState {
  INPUT_EMAIL,
  INPUT_PASSWORD,
  CREATE_PASSWORD,
  KYC_DETAILS,
  ENTER_PHONE
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
