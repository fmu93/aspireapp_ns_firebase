import { Observable } from "data/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { BackendService } from "../../shared/services/backend.service";
import { Image } from "tns-core-modules/ui/image/image";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { InstagramUser, CustomImage, ExtendedUser } from "./../../shared/user.model";
import * as Toast from "nativescript-toast";
import { topmost } from "ui/frame";
import { InstaImage } from "../../shared/services/instagram.service";
import { ListViewEventData } from "nativescript-pro-ui/listview";


export class SearchViewModel extends Observable {
    @ObservableProperty() loadedImgList = new ObservableArray<CustomImage>();
    @ObservableProperty() user: ExtendedUser;
    @ObservableProperty() guest: ExtendedUser;
    public guests = new ObservableArray<ExtendedUser>();
    private userIndex = 0;
    private userSize = 1;

    constructor() {
        super();
        this.loadUser();
        this.loadGuests();
    }

    public loadUser() {
        this.user = BackendService.getUser();
    }

    public loadGuests() {
        // TODO check that all users are being loaded
        BackendService.getUsersCollection().then(guests => {
            // empty current guests
            this.loadedImgList = new ObservableArray<CustomImage>();
            // load with users 
            for (var guest in guests) {
                this.guests.push(guests[guest]);
            }
            this.userSize = this.guests.length;
        });
    }

    public loadGuest() {
            this.guest = this.guests[this.userIndex];
            // empty current loadedImageList
            for (var i = 0; i < this.loadedImgList.length; i++) {
                this.loadedImgList.splice(i);
            };
            // load with images from current user
            for (var key in this.guest.imageList) {
                this.loadedImgList.push(this.guest.imageList[key]);
            }
            // sort assuming all images are milliseconds as filename
            this.loadedImgList.sort(function(a, b) {
                return parseFloat(b.id) - parseFloat(a.id);
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
}
