import { Observable } from "data/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { EventData } from "data/observable";
import { BackendService } from "./../../shared/services/backend.service";
import { ExtendedUser } from "../../shared/user.model";
import * as dialogs from "ui/dialogs";
import * as frameModule from "ui/frame";
import * as utils from "utils/utils";

export class LoginModel extends Observable {
    @ObservableProperty() user: ExtendedUser;

    constructor() {
        super();
        this.user = BackendService.getUser();
    }

    public signIn() {
        // Actually, the only way to be logged in at this point is after successful registration
        // or successful login. Maybe a switch user does make sense.
        BackendService.logout()
        .then(() => {
            // TODO check binding of email and password fields are updated
            const promise2 = BackendService.login(this.user)
            .then(() => {
                if (BackendService.isLoggedIn()) {
                    this.navigateHolder();
                } else {
                    dialogs.alert("user not logged in: " + this.user.username);
                }
            }).catch((error) => {
                dialogs.alert({
                    title: "Error loggin in",
                    message: error,
                    okButtonText: "Back"
                });
            }).catch((error) => {
                console.log(error);
            });
        });
    }

    public navigateRegister(args) {
        return frameModule.topmost().navigate("views/register/register");
    }

    public onPageTapped(args: EventData) {
        utils.ad.dismissSoftInput();
    }

    public onReturnPress(args) {
        this.signIn();
    }

    public navigateHome() {
        return frameModule.topmost().navigate("views/home/home-page");
    }

    public navigateHolder() {
        return frameModule.topmost().navigate("views/holder/holder-page");
    }

}