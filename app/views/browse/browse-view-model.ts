import { Observable } from "data/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { ObservableArray } from "data/observable-array";
import { BackendService } from "../../shared/services/backend.service";
import { InstagramUser } from "../../shared/user.model";

const tmobservable = new Observable();

export class BrowseViewModel extends Observable {
    @ObservableProperty()
    public users: Array<InstagramUser>;

    constructor() {
        super();
    }

    private setUsers(array: Array<InstagramUser>) {
        this.users = array;
        tmobservable.set("users", this.users);
    }

    public lookUp() {
        BackendService.getUsersCollection().then(users => {
            this.users = users
        });
    };
    
}
