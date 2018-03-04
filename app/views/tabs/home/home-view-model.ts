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
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { InstagramService, InstaMediaList, InstaImage } from "../../../shared/services/instagram.service";
import * as dialogs from "ui/dialogs";

export class HomeViewModel extends Observable {
    // public username: string;
    public type: string;
    public gender: string;
    public birthYear: string;
    public bio: string;
    public loadedImgList = new ObservableArray<InstaImage>();
    public user: User;
    // instagram counts TODO
    public follows: string;
    public followed_by: string;
    public media: string;

    constructor() {
        super();
        this.loadedImgList.push(new InstaImage());
        this.loadThisUser();
        this.doAddChildEventListenerUser();
        }

    public loadThisUser() {
        BackendService.getThisUserCollection().then((user: User) => {
            this.user = user;
            // empty current loadedImageList
            for (var i = 1; i < this.loadedImgList.length; i++) {
                this.loadedImgList.splice(i);
            };
            // load with images from current user
            for (var key in user.instaImageList) {
                this.loadedImgList.push(user.instaImageList[key]);
            }
            this.loadedImgList.shift();
            // sort assuming all images are milliseconds as filename
            this.loadedImgList.sort(function(a, b) {
                return parseFloat(b.created_time) - parseFloat(a.created_time);
            });
            // loading instagram counts
            this.followed_by = String(user.counts.followed_by);
            this.follows = String(user.counts.follows);
            this.media = String(user.counts.media);
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
            message: this.loadedImgList.getItem(args.index).caption.text,
            okButtonText: "Delete",
            cancelButtonText: "Cancel"
        })
        // .then(result => {
        //     if (result) {
        //         BackendService.deleteFile(this.loadedImgList.getItem(args.index).remoteLocation)
        //         .then((result) => {
        //             BackendService.removeImageFromList(this.loadedImgList.getItem(args.index).filename).then(() => {
        //                 Toast.makeText("Deleted: " + this.loadedImgList.getItem(args.index).filename).show();
        //                 this.loadThisUser();
        //             });
        //         });
        //     }
        // });
    }

    public doAddChildEventListenerUser(): void {
        const onChildEvent = result => {
            this.set(result.key,  result.value);
        };
        BackendService.addDatabseListener(onChildEvent, "/users/" + BackendService.token);
    }

    public updateProperties() {
        const properties = {
            "type": this.type,
            "gender": this.gender,
            "birthYear": Number.parseInt(this.birthYear),
            "bio": this.bio
        }
        BackendService.updateUserProperties(properties).then(() => {
            Toast.makeText("Updated user properties").show();
        });
    }
  
}
