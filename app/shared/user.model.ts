import { Observable } from "tns-core-modules/ui/page/page";
import { ObservableProperty } from "./observable-property-decorator";
import firebase = require("nativescript-plugin-firebase");
import { BackendService } from "./services/backend.service";
import { InstagramService, InstaMediaList, InstaImage } from "./services/instagram.service";
require("nativescript-localstorage");
const validator = require("email-validator");

export class User extends Observable {
  public username: string;
  public uid: string;
  public instagramToken: string;
  public email: string;
  public password: string;
  public gender: string;
  public birthYear: number;
  public bio: string;
  public type: string;
  public imageList: Array<ImageCustom> = new Array<ImageCustom>();
  public instaImageList: Array<InstaImage> = new Array<InstaImage>();
  
  // instagram model
  public id: string;
  public full_name: string;
  public profile_picture: string;
  public website: string;
  public is_business: boolean;
  public counts: {
    "media": number, 
    "follows": number, 
    "followed_by": number
  }

  constructor() {
    super();
  }

  public loadFirebaseUser(fu: firebase.User) {
    this.username = fu.name;
    this.email = fu.email;
    this.uid = fu.uid;
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
