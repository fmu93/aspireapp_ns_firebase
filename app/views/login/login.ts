import { EventData, fromObject } from "data/observable";
import { View } from "ui/core/view";
import * as dialogs from "ui/dialogs";
import { EditableTextBase } from "ui/editable-text-base";
import * as frameModule from "ui/frame";
import { Page } from "ui/page";
import { BackendService } from "./../../shared/services/backend.service";
import { User } from "./../../shared/user.model";
import * as utils from "utils/utils";
import * as webViewModule from "tns-core-modules/ui/web-view";
import view = require("ui/core/view");

const user = new User();
// let webView = new webViewModule.WebView();

export function onLoaded(args) {

    const page = <Page>args.object;
    page.bindingContext = user;

    // webView = <webViewModule.WebView>view.getViewById(page, "webView");
}

export function pageNavigatedTo(args: EventData): void {
    const page: Page = <Page>args.object;
    const userRegistered = page.navigationContext;
    // page.bindingContext = userRegistered; // TODO get user from register page when success
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

export function register(args) {
    frameModule.topmost().navigate("views/register/register");
}

export function onPageTapped(args: EventData) {
    utils.ad.dismissSoftInput();
}

export function onReturnPress(args) {
    signIn(args);
}

export function instagramAuth() {
    frameModule.topmost().navigate("views/instagramLogin/instagramLogin");

    
}
