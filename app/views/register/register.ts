import { EventData, fromObject, Observable } from "data/observable";
import { View } from "ui/core/view";
import * as dialogs from "ui/dialogs";
import { EditableTextBase } from "ui/editable-text-base";
import * as frameModule from "ui/frame";
import { Page } from "ui/page";
import { BackendService } from "./../../shared/services/backend.service";
import { User } from "./../../shared/user.model";

const user = new User();
// const user = require("./../../shared/user.model");

export function onLoaded(args) {
    const page = args.object;
    page.bindingContext = user;
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
    const promise = BackendService.register(user)
    .then(() => {
    // trying to save user into local storage on first singup
    user.storeUser();
    })
    .then(() => {
        dialogs.alert("User registered and stored: " + user.username);
        BackendService.logout();
        frameModule.topmost().navigate("views/login/login");
    })
    .catch((error) => {
        dialogs.alert("Error in registration");
        console.log(error);
    });
}

export function navigateLogin() {
    return frameModule.topmost().navigate("views/login/login");
}

let closeTimeout = 0;
export function onPageTapped(args: EventData) {
    const page = <Page>args.object;
    if (!closeTimeout) {
        closeTimeout = setTimeout(() => {
            page.getViewById<EditableTextBase>("username").dismissSoftInput();
            page.getViewById<EditableTextBase>("email").dismissSoftInput();
            page.getViewById<EditableTextBase>("password").dismissSoftInput();
            page.getViewById<EditableTextBase>("bio").dismissSoftInput();
            closeTimeout = 0;
        }, 20);
    }
}
