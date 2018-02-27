import { Observable } from "data/observable";
import { ObservableProperty } from "../../../shared/observable-property-decorator";
import { BackendService } from "../../../shared/services/backend.service";
import { Image } from "tns-core-modules/ui/image/image";
import * as observableArray from "tns-core-modules/data/observable-array";
import { User, ImageCustom } from "./../../../shared/user.model";


export class SearchViewModel extends Observable {
    @ObservableProperty()
    public guestName: string;
    public imgA: string;
    public imgB: string;
    private userIndex = 0;
    private userSize = 1;
    public loadedImgList = new observableArray.ObservableArray(new Array<ImageCustom>());

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
            console.log(this.loadedImgList);
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
}
