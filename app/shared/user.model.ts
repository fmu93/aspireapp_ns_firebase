import { Observable } from "tns-core-modules/ui/page/page";

// import { Kinvey } from "kinvey-nativescript-sdk";
require("nativescript-localstorage");
const validator = require("email-validator");

export class User extends Observable {
  username?: string;
  email?: string;
  password?: string;
  age?: number;
  gender?: string;
  bio?: string;
  imageList?: {};

  // constructor() {
  //   super();
  // }

  storeUser() {
    localStorage.setItem("newUser", JSON.stringify(this));  // TODO strings index
  }

  retrieveUser() {
    const prevUser = JSON.parse(localStorage.getItem("newUser")); // TODO string index
    if (prevUser) {
      this.username = prevUser.username;
      this.email = prevUser.email;
      this.password = prevUser.password;
    }

    return this;
  }

  printUser() {
    return console.log(this.username + " pass: " + this.password);
  }

  isValidEmail() {
    return validator.validate(this.email);
  }
}
