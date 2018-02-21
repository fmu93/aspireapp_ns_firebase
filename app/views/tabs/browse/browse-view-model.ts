import { Observable } from "data/observable";
import { ObservableArray } from "data/observable-array";
import { BackendService } from "../../../shared/services/backend.service";
import { User } from "../../../shared/user.model";

const tmobservable = new Observable();

export class BrowseViewModel extends Observable {
    users: Array<User>;

    constructor() {
        super();
    }

    setUsers(array: Array<User>) {
        this.users = array;
        tmobservable.set("users", this.users);
        // return this.users = tmobservable.set("users", array);
    }
}
