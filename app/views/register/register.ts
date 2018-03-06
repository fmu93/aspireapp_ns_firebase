import { EventData, fromObject, Observable } from "data/observable";
import { View } from "ui/core/view";
import * as dialogs from "ui/dialogs";
import { EditableTextBase } from "ui/editable-text-base";
import * as frameModule from "ui/frame";
import { Page } from "ui/page";
import { BackendService } from "./../../shared/services/backend.service";
import { InstagramUser } from "./../../shared/user.model";
import * as utils from "utils/utils";

const user = new InstagramUser();

export function onLoaded(args) {
    const page = args.object;
    page.bindingContext = user;
}

export function pageNavigatedTo(args: EventData): void {
    const page: Page = <Page>args.object;
    if (page.navigationContext) {
        const userLogging = <InstagramUser>page.navigationContext.user;
        page.bindingContext = userLogging; // TODO get user from register page when success
    }
}

export function signUp() {
    if (BackendService.isLoggedIn()) {
        const promise1 = BackendService.logout()
        .then(() => {
            dialogs.alert("user logged off").then(() => {
                completeRegistration();
                console.log("success loggin off");
            }).catch((error) => {
                console.log(error);
            });
        });
    } else if (user.isValidEmail()) {
        completeRegistration();
    } else {
        dialogs.alert({
            message: "Enter a valid email address.",
            okButtonText: "OK"
        });
    }
}

export function completeRegistration() {
    BackendService.register(user)
    .then((result) => {
        if (result) {
            BackendService.logout();
            dialogs.alert({
                title: user.email,
                message: "You are now registered"
            })
            return navigateLogin();
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

export function navigateLogin() {
    const navigationEntry = {
        moduleName: "views/login/login",
        context: {"user": user},
        animated: false,
        clearHistory: true
    };
    return frameModule.topmost().navigate(navigationEntry);
}


export function onPageTapped(args: EventData) {
    utils.ad.dismissSoftInput();
}
