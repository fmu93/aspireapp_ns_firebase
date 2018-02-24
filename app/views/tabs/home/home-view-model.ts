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
import { User } from "./../../../shared/user.model";

export class HomeViewModel extends Observable {
    @ObservableProperty()
    public imgSrc: string;

    constructor() {
        super();
    }

    public imgTap() {
        Toast.makeText(String(this.imgSrc)).show();
    }
    
    public imgSelect() {
        const milliseconds = (new Date()).getTime();
        const context = imagepicker.create({
            mode: "single"
        });
        context.authorize().then(() => {
            return context.present();
        }).then((selection) => {
            selection.forEach((element) => {    
                this.imgSrc = element.fileUri;
                const remotePath = BackendService.makeImgRemotePath(String(milliseconds), element.fileUri.split(".").pop());
                BackendService.uploadFile(remotePath, element.fileUri);
            });
        });
    }
    
    public imgUpload() {
        const appPath = fs.knownFolders.currentApp();
        const localPath = "/res/pengbrew.png";
        const localFullPath = fs.path.join(appPath.path, localPath);
        const remotePath = BackendService.makeImgRemotePath("pengbrew", "png");
        BackendService.uploadFile(remotePath, localFullPath);
    }
    
    public imgDownload() {
        const promise = BackendService.getDownloadUrl("arctic.png")
        .then((url: string) => {
            this.imgSrc = url;
            console.log("Downloaded: " + this.imgSrc);
        }).catch((error) => {
            console.log(error);
        });
    }
    
    public storeByPush() {
        BackendService.doUserStore();
    }

    public showUserModel() {
        BackendService.printUser();
    }
    
}
