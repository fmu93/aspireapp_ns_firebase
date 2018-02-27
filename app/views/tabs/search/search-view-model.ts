import { Observable } from "data/observable";
import { ObservableProperty } from "../../../shared/observable-property-decorator";
import { BackendService } from "../../../shared/services/backend.service";
import { Image } from "tns-core-modules/ui/image/image";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { User, ImageCustom } from "./../../../shared/user.model";
import * as Toast from "nativescript-toast";


export class SearchViewModel extends Observable {
    @ObservableProperty() public guestName: string;
    @ObservableProperty() public guestType: string;
    @ObservableProperty() public guestBio: string;
    private userIndex = 0;
    private userSize = 1;
    public loadedImgList = new ObservableArray<ImageCustom>();

    constructor() {
        super();
        this.loadedImgList.push(new ImageCustom("", "", ""));
        this.loadGuest();
    }

    public loadGuest() {
        BackendService.getUsersCollection().then((users: User[]) => {
            this.userSize = users.length;
            const guest = users[this.userIndex];
            this.guestName = guest.username;
            this.guestType = guest.type;
            this.guestBio = guest.bio;

            // empty current loadedImageList
            for (var i = 1; i < this.loadedImgList.length; i++) {
                this.loadedImgList.splice(i);
            };
            // load with images from current user
            for (var key in guest.imageList) {
                this.loadedImgList.push(guest.imageList[key]);
            }
            this.loadedImgList.shift();
            // sort assuming all images are milliseconds as filename
            this.loadedImgList.sort(function(a, b) {
                return parseFloat(b.filename) - parseFloat(a.filename);
            });          
        }).catch((error) => {
            console.log(error);
        });
    }

    public nextUser() {
        this.userIndex = (this.userIndex + 1 ) % this.userSize;
        this.loadGuest();
    }

    public prevUser() {
        this.userIndex = (this.userIndex - 1 ) % this.userSize;
        this.loadGuest();
    }

    public imgTap(args) {
        Toast.makeText("Filename: " + this.loadedImgList.getItem(args.index).filename).show();
    }
}
