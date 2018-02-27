import { Observable } from "tns-core-modules/ui/page/page";
import { ObservableProperty } from "./observable-property-decorator";
import firebase = require("nativescript-plugin-firebase");
import { BackendService } from "./services/backend.service";
require("nativescript-localstorage");
const validator = require("email-validator");

export class User extends Observable {
  public username: string;
  public uid: string;
  public email: string;
  public password: string;
  public gender: string;
  public birthYear: number;
  public bio: string;
  public type: string;
  public imageList: Array<ImageCustom> = new Array<ImageCustom>();

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
      this.username = prevUser._username;
      this.email = prevUser.email;
      this.password = prevUser.password;
    }

    return this;
  }

  public isValidEmail() {
    return validator.validate(this.email);
  }
}

export class ImageCustom extends Observable {
  filename: string;
  public: boolean = true;
  remoteLocation: string;
  url: string;
  name: string;
  caption: string = "caption this"; // "lovely weather!"
  contentType: string; //image/jpeg
  created: string; // 2018-02-27T12:08:43.752Z
  updated: string; //2018-02-27T12:08:43.752Z
  bucket: string; //aspireapp-2dff5.appspot.com
  size: number; // 22393

  constructor(filename: string, remoteLocation: string, url: string) {
    super();
    this.filename = filename;
    this.remoteLocation = remoteLocation;
    this.url = url;
  };
}
