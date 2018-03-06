import { ObservableProperty } from "../../shared/observable-property-decorator";
import { EventData, Observable } from "data/observable";
import imagepicker = require("nativescript-imagepicker");
import * as Toast from "nativescript-toast";
import { BackendService } from "../../shared/services/backend.service";
import { InstagramUser } from "./../../shared/user.model";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { InstagramService, InstaMediaList, InstaImage } from "../../shared/services/instagram.service";
import { ListViewEventData } from "nativescript-pro-ui/listview";
import * as dialogs from "ui/dialogs";
import { topmost } from "ui/frame";

export class HomeViewModel extends Observable {
    // public username: string;
    public type: string;
    public gender: string;
    public birthYear: string;
    public bio: string;
    public loadedImgList = new ObservableArray<InstaImage>();
    public user: InstagramUser;
    // instagram counts TODO
    @ObservableProperty() follows: string;
    @ObservableProperty() followed_by: string;
    @ObservableProperty() media: string;

    constructor() {
        super();
        this.loadedImgList.push(new InstaImage());
        this.loadThisUser();
        this.doAddChildEventListenerUser();
        }

    public loadThisUser() {
        BackendService.getThisUserCollection().then(user => {
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

    public onItemTap(args: ListViewEventData): void {
        const tappedImgItem = <InstaImage>args.view.bindingContext;
    
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
