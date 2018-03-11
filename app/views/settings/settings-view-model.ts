import { Observable } from "data/observable";
import { BaseUser } from "../../shared/user.model";
import { BackendService } from "../../shared/services/backend.service";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import * as Toast from "nativescript-toast";

export class SettingsViewModel extends Observable {
    @ObservableProperty() user: BaseUser;
    public genders = ["Female", "Male", "Other"];
    public types = ["Photographer", "Model", "Business"];

    constructor() {
        super();
        this.user = <BaseUser>BackendService.getUser();
    }

    public updateProperties() {
        const properties = <BaseUser> this.user;
        BackendService.updateUserProperties(properties).then(() => {
            Toast.makeText("Updated user properties").show();
        });
    }

    public onProfilePictureTapped() {
        Toast.makeText("It's me, " + this.user.username).show();
    }

}

