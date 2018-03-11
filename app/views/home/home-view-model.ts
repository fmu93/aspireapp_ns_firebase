import { ObservableProperty } from "../../shared/observable-property-decorator";
import { EventData, Observable } from "data/observable";
import imagepicker = require("nativescript-imagepicker");
import * as Toast from "nativescript-toast";
import { BackendService } from "../../shared/services/backend.service";
import { ExtendedUser, BaseUser, CustomImage } from "./../../shared/user.model";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { InstagramService, InstaMediaList, InstaImage } from "../../shared/services/instagram.service";
import { ListViewEventData } from "nativescript-pro-ui/listview";
import * as dialogs from "ui/dialogs";
import { topmost } from "ui/frame";
import * as utils from "utils/utils";

export class HomeViewModel extends Observable {
    // public username: string;
    @ObservableProperty() loadedImgList = new ObservableArray<any>();
    @ObservableProperty() user: ExtendedUser;

    constructor() {
        super();
        this.loadUser();
        this.loadImages();
        utils.ad.dismissSoftInput();
    }

    public loadUser() {
        this.user = BackendService.getUser();
    }

    public loadImages() {
            // empty current loadedImageList
            this.loadedImgList = new ObservableArray<any>();
            // load with images from current user
            for (var key in this.user.instaImageList) {
                this.loadedImgList.push(this.user.instaImageList[key]);
            }
            for (var key in this.user.imageList) {
                this.loadedImgList.push(this.user.imageList[key]);
            }
            // sort assuming all images are milliseconds as filename
            this.loadedImgList.sort(function(a, b) {
                return parseFloat(b.created_time) - parseFloat(a.created_time);
            });
    }
    
    public imgAdd() {
        const context = imagepicker.create({
            mode: "single"
        });
        context.authorize().then(() => {
            return context.present();
        }).then(selection => {
            selection.forEach(element => {
                const localPath =  element.fileUri;   
                BackendService.uploadFile(localPath).then(uploadFileResult => {
                    Toast.makeText("Uploaded!").show();
                    setTimeout(() => this.loadImages(), 1000);
                });
            });
        });
    }

    public onItemTap(args: ListViewEventData): void {
        const tappedImgItem = <CustomImage>args.view.bindingContext;
    
        topmost().navigate({
            moduleName: "views/image-detail/image-detail-page",
            context: tappedImgItem,
            animated: true,
            transition: {
                name: "slide",
                duration: 200,
                curve: "ease"
            }
        });
    }
    
    public onProfilePictureTapped() {
        Toast.makeText("It's me, " + this.user.username).show();
    }

 
}

