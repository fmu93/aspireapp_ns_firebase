import { Observable, EventData } from "tns-core-modules/ui/page/page";
import * as dialogs from "ui/dialogs";
import * as frameModule from "ui/frame";
import { BackendService } from "./../../shared/services/backend.service";
import { ExtendedUser } from "./../../shared/user.model";
import * as utils from "utils/utils";
import { ObservableProperty } from "../../shared/observable-property-decorator";


export class RegisterModel extends Observable {
    @ObservableProperty() user: ExtendedUser;

    constructor() {
        super();
        this.user = BackendService.getUser();
    }
    
    public signUp() {
        if (BackendService.isLoggedIn()) {
            const promise1 = BackendService.logout()
            .then(() => {
                dialogs.alert("user logged off").then(() => {
                    this.completeRegistration();
                    console.log("success loggin off");
                }).catch((error) => {
                    console.log(error);
                });
            });
        } else if (this.user.isValidEmail()) {
            this.completeRegistration();
        } else {
            dialogs.alert({
                message: "Enter a valid email address.",
                okButtonText: "OK"
            });
        }
    }

    public completeRegistration() {
        BackendService.register(this.user)
        .then((result) => {
            if (result) {
                BackendService.logout();
                dialogs.alert({
                    title: this.user.email,
                    message: "You are now registered"
                })
                return this.navigateLogin();
            } else {
                dialogs.alert({
                    title: "Error",
                    message: "Perhaps try a different email",
                    okButtonText: "Back"
                });
            }
        })
        .catch((error) => {
            dialogs.alert("Error in registration");
            console.log(error);
        });
    }

    public navigateLogin() {
        const navigationEntry = {
            moduleName: "views/login/login",
            context: {"user": this.user},
            animated: false,
            clearHistory: true
        };
        return frameModule.topmost().navigate(navigationEntry);
    }

    public onPageTapped(args: EventData) {
        utils.ad.dismissSoftInput();
    }

}