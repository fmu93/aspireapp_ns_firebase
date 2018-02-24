import { Observable } from "tns-core-modules/ui/page/page";
require("nativescript-localstorage");
const validator = require("email-validator");

export class User extends Observable {
  public username?: string;
  public email?: string;
  public password?: string;
  public gender?: string;
  public birthYear?: number;
  public bio?: string;
  public imageList?: {};

  // constructor() {
  //   super();
  // }

  public storeUser() {
    localStorage.setItem("newUser", JSON.stringify(this));  // TODO strings index
  }

  public retrieveUser() {
    const prevUser = JSON.parse(localStorage.getItem("newUser")); // TODO string index
    if (prevUser) {
      this.username = prevUser.username;
      this.email = prevUser.email;
      this.password = prevUser.password;
    }

    return this;
  }

  public printUser() {
    return console.log(this.username + " pass: " + this.password);
  }

  public isValidEmail() {
    return validator.validate(this.email);
  }
}
