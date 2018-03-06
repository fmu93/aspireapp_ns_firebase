import { Observable } from "data/observable";
import { InstagramUser } from "../../shared/user.model";
import { BackendService } from "../../shared/services/backend.service";

export class SettingsViewModel extends Observable {
    public genders = ["Female", "Male", "Other"];

    constructor() {
        super();
    }
}
