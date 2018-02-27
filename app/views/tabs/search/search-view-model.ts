import { Observable } from "data/observable";
import { ObservableProperty } from "../../../shared/observable-property-decorator";
import { BackendService } from "../../../shared/services/backend.service";
import { Image } from "tns-core-modules/ui/image/image";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { User, ImageCustom } from "./../../../shared/user.model";
import * as Toast from "nativescript-toast";


export class SearchViewModel extends Observable {
    @ObservableProperty()
    public guestName: string;
    public imgA: string;
    public imgB: string;
    private userIndex = 0;
    private userSize = 1;
    public loadedImgList = new ObservableArray<ImageCustom>();

    constructor() {
        super();
        this.loadGuest();
    }

    public loadGuest() {
        BackendService.getUsersCollection().then(users => {
            this.userSize = users.length;
            const guest = users[this.userIndex];
            this.guestName = guest._username;

            // empty current loadedImageList
            for (var img in this.loadedImgList) {
                this.loadedImgList.pop();
            };
            // load with images from current user
            for (var key in guest.imageList) {
                this.loadedImgList.push(guest.imageList[key]);
            }
            // sort assuming all images are milliseconds as filename
            this.loadedImgList.sort(function(a, b) {
                return parseFloat(a.filename) - parseFloat(b.filename);
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

    public passImg(img: Image) {
        img.src = this.imgA;
    }

    public imgTap(args) {
        Toast.makeText("Filename: " + this.loadedImgList.getItem(args.index).filename).show();
    }
}
