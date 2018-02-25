import { Observable } from "data/observable";
import { ObservableProperty } from "../../../shared/observable-property-decorator";
import { ObservableArray } from "data/observable-array";
import { BackendService } from "../../../shared/services/backend.service";
import { User } from "../../../shared/user.model";

const tmobservable = new Observable();

export class BrowseViewModel extends Observable {
    @ObservableProperty()
    users: Array<User>;

    constructor() {
        super();
    }

    private setUsers(array: Array<User>) {
        this.users = array;
        tmobservable.set("users", this.users);
        // return this.users = tmobservable.set("users", array);
    }

    public lookUp() {
        BackendService.getUsersCollection().then(users => {
            this.users = users
            console.log(JSON.stringify(users));
        });
        // const result = BackendService.doQueryUsers();
    };
    
}
