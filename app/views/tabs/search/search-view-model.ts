import { Observable } from "data/observable";
import { ObservableProperty } from "../../../shared/observable-property-decorator";
import { BackendService } from "../../../shared/services/backend.service";
import { Image } from "tns-core-modules/ui/image/image";
import * as observableArray from "tns-core-modules/data/observable-array";


export class SearchViewModel extends Observable {
    @ObservableProperty()
    public guestName: string;
    public imgA: string;
    public imgB = "https://firebasestorage.googleapis.com/v0/b/aspireapp-2dff5.appspot.com/o/arctic.png?alt=media&token=a12068a1-8fdd-4ab5-a5bd-b19030d4ebdc";
    private userIndex = 0;
    private users = [{}];
    private userSize = 1;
    public imgUrls = new observableArray.ObservableArray({url: ""});

    constructor() {
        super();
    }

    public loadGuest() {
        BackendService.getUsersCollection().then(users => {
            this.users = users;
            this.userSize = this.users.length;
            const userA = users[this.userIndex];
            this.guestName = userA.username;
            
            console.dir(this.imgUrls);
            for (var url in this.imgUrls) {
                this.imgUrls.pop();
            }
            const imagesRemote = new Array<string>();

            for (var key in userA.imageList) {
                imagesRemote.push(userA.imageList[key].remoteLocation);
            }
            imagesRemote.forEach(imgRemote => {
                BackendService.getDownloadUrl(imgRemote).then((url: string) => {
                    this.imgUrls.push({url});
                }).catch((error) => {
                    console.log(error);
                });
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
}
