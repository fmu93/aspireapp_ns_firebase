import { Image } from "ui/image";
import { ObservableProperty } from "../../../shared/observable-property-decorator";
import { EventData, Observable } from "data/observable";
import fs = require("file-system");
import * as imageSourceModule from "image-source";
import imagepicker = require("nativescript-imagepicker");
import * as Toast from "nativescript-toast";
import { ImageSource } from "tns-core-modules/image-source/image-source";
import view = require("ui/core/view");
import * as frameModule from "ui/frame";
import { StackLayout } from "ui/layouts/stack-layout";
import { BackendService } from "../../../shared/services/backend.service";
import { User, ImageCustom } from "./../../../shared/user.model";
import * as observableArray from "tns-core-modules/data/observable-array";
import * as dialogs from "ui/dialogs";

export class HomeViewModel extends Observable {
    @ObservableProperty()
    public username: string;
    public type: string;
    public gender: string;
    public birthYear: string;
    public bio: string;
    public loadedImgList = new observableArray.ObservableArray(new Array<ImageCustom>());
    public user: User;

    constructor() {
        super();
        this.loadThisUser();
    }

    public loadThisUser() {
        BackendService.getThisUserCollection().then((user: User) => {
            this.user = user;
            this.username = user._username;
            this.gender = user.gender;
            this.type = user.type;
            this.birthYear = String(user.birthYear);
            this.bio = user.bio;
            // empty current loadedImageList
            for (var img in this.loadedImgList) {
                this.loadedImgList.pop();
            };
            // load with images from current user
            for (var key in user.imageList) {
                this.loadedImgList.push(user.imageList[key]);
            }
            // sort assuming all images are milliseconds as filename
            this.loadedImgList.sort(function(a, b) {
                return parseFloat(a.filename) - parseFloat(b.filename);
            });
        }).catch(error => console.log(error));
    }
    
    public imgAdd() {
        const filename = String((new Date()).getTime());
        const context = imagepicker.create({
            mode: "single"
        });
        context.authorize().then(() => {
            return context.present();
        }).then((selection) => {
            selection.forEach((element) => {    
                const remotePath = BackendService.makeImgRemotePath(filename, element.fileUri.split(".").pop());
                BackendService.uploadFile(remotePath, element.fileUri).then((uploadFileResult) => {
                    BackendService.addToImageList(filename, remotePath, uploadFileResult.url).then(() => {
                        Toast.makeText("Added: " + filename).show();
                        this.loadThisUser();
                    });
                });
            });
        });
    }

    public imgTap(args) {
        dialogs.confirm({
            title: "Delete this pic?",
            message: this.loadedImgList.getItem(args.index).filename,
            okButtonText: "Delete",
            cancelButtonText: "Cancel"
        }).then(result => {
            if (result) {
                BackendService.deleteFile(this.loadedImgList.getItem(args.index).remoteLocation)
                .then((result) => {
                    BackendService.removeImageFromList(this.loadedImgList.getItem(args.index).filename).then(() => {
                        Toast.makeText("Deleted: " + this.loadedImgList.getItem(args.index).filename).show();
                        this.loadThisUser();
                    });
                });
            }
        });
    }
  
}
