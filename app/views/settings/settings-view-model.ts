import { Observable } from "data/observable";
import { BaseUser } from "../../shared/user.model";
import { BackendService } from "../../shared/services/backend.service";

export class SettingsViewModel extends Observable {
    public genders = ["Female", "Male", "Other"];
    public types = ["Photographer", "Model", "Business"];

    constructor() {
        super();
        this.user = <BaseUser>BackendService.getUser();
    }

    set user(value: BaseUser) {
        this.set("_user", value);
    }

    get user(): BaseUser {
        return this.get("_user");
    }
}

