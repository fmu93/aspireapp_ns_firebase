import { Observable } from "data/observable";
import { InstagramUser } from "../../shared/user.model";

export class SettingsViewModel extends Observable {
    private _types: Array<string>;
    private user: InstagramUser;

    constructor() {
        super();
    }

    get types() {
        if (!this._types) {
            this._types = new Array<string>("Model", "Photographer", "Influencer", "Graphic Designer", "Make up artist", "Local business", "Global business");
        }
        return this._types;
    }
}