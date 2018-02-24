import { EventData, fromObject } from "data/observable";
import { View } from "ui/core/view";
import * as dialogs from "ui/dialogs";
import { EditableTextBase } from "ui/editable-text-base";
import * as frameModule from "ui/frame";
import { Page } from "ui/page";
import { BackendService } from "./../../shared/services/backend.service";
import { User } from "./../../shared/user.model";

const user = new User();

export function onLoaded(args) {
    // check if existing user on local storage
    user.loadLocalUser();

    const page = <Page>args.object;
    page.bindingContext = user;
 }

export function signIn(args) {
    // Actually, the only way to be logged in at this point is after successful registration
    // or successful login. Maybe a switch user does make sense.
    const promise = BackendService.logout()
    .then(() => {
        const promise2 = BackendService.login(user)
        .then(() => {
            if (BackendService.isLoggedIn()) {
                frameModule.topmost().navigate("views/tabs/tabs-page");
            } else {
                dialogs.alert("user not logged in: " + user.username);
            }
        }).catch((error) => {
            dialogs.alert("Error logging in: " + user.username);
            // console.log(error);
    }).catch((error) => {
        console.log(error);
    });
    });
}

export function register(args) {
    frameModule.topmost().navigate("views/register/register");
}

let closeTimeout = 0;
export function onPageTapped(args: EventData) {
    const page = <Page>args.object;
    if (!closeTimeout) {
        closeTimeout = setTimeout(() => {
            page.getViewById<EditableTextBase>("username").dismissSoftInput();
            page.getViewById<EditableTextBase>("password").dismissSoftInput();
            closeTimeout = 0;
        }, 20);
    }
}
