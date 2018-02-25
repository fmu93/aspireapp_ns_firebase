import { Observable } from "tns-core-modules/ui/page/page";
import { ObservableProperty } from "./observable-property-decorator";
import firebase = require("nativescript-plugin-firebase");
import { BackendService } from "./services/backend.service";
require("nativescript-localstorage");
const validator = require("email-validator");

export class User extends Observable {
  @ObservableProperty() 
  public username: string;
  public uid: string;
  public email: string;
  public password: string;
  public gender: string = "user.gender";
  public birthYear: number;
  public bio: string;
  public imageList: {};

  // constructor() {
  //   super();
  // }

  public loadFirebaseUser(fu: firebase.User) {
    this.username = fu.name;
    this.email = fu.email;
    this.uid = fu.uid;
  }

  public storeUser() {
    localStorage.setItem("newUser", JSON.stringify(this));  // TODO strings index
  }

  public loadLocalUser() {
    const prevUser = JSON.parse(localStorage.getItem("newUser")); // TODO string index
    if (prevUser) {
      this.username = prevUser.username;
      this.email = prevUser.email;
      this.password = prevUser.password;
    }

    return this;
  }

  public isValidEmail() {
    return validator.validate(this.email);
  }
}
