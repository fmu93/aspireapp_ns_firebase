import { Observable } from "data/observable";
import { InstagramUser } from "../../shared/user.model";
import { BackendService } from "../../shared/services/backend.service";

export class SettingsViewModel extends Observable {
    public genders = ["Female", "Male", "Other"];
    public types = ["Photographer", "Model", "Business"];

    constructor() {
        super();
        this.user = BackendService.getUser();
    }

    set user(value: InstagramUser) {
        this.set("_user", value);
    }

    get user(): InstagramUser {
        return this.get("_user");
    }

    convertFrom(id: number) {
        return this.types[id];
    }

    convertTo(name: string) {
        return this.types.indexOf(name);
    }
}

export class User {
    public username: string;
    public uid: string;
    public email: string;
    public password: string;
    public gender: string;
    public birthYear: number;
    public birthDate: string;
    public type: string;

    constructor (username, birthYear, email, type, gender) {
        this.username = username;
        this.birthYear = birthYear;
        this.email = email;
        this.gender = gender;
        this.type = type;
    }
}
