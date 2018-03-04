import view = require("ui/core/view");
import { Page } from "ui/page";
import { instagramLoginModel } from "./instagramLogin-model";
import * as webViewModule from "tns-core-modules/ui/web-view";
import * as frameModule from "ui/frame";
import * as dialogs from "ui/dialogs";
import { BackendService } from "./../../shared/services/backend.service";
import { InstagramService } from "./../../shared/services/instagram.service";
import * as http from "http";

let webView = new webViewModule.WebView();
let instagramToken = "";

export function onLoaded(args) {

    const page = <Page>args.object;
    page.bindingContext = new instagramLoginModel();
    webView = <webViewModule.WebView>view.getViewById(page, "webView");
    loadUrl();
}

export function loadUrl() {
    // Open the Auth flow in a popup.
    const url = "https://api.instagram.com/oauth/authorize/?client_id=ada6cfdfd31547eba0c005834067b9c4&redirect_uri=http://localhost:8080/instagram-callback&response_type=token";
    webView.src = url;
    webView.on(webViewModule.WebView.loadFinishedEvent, function (args: webViewModule.LoadEventData) {
        if (args.url && args.url.includes("access_token=")) {
            // update instagram token for user
            InstagramService.instaToken = args.url.split("access_token=").pop();
            InstagramService.updateFirebaseUser();
            webView.off(webViewModule.WebView.loadFinishedEvent);
            dialogs.alert({
                title: "Sucess",
                message: "Aspire and Instagram now binded"
            })
            return
            
        } else if (!args.error) {
            // dunno
        } else {
            dialogs.alert({
                message: "Error loading " + args.url + ": " + args.error
            });
        }
    });
}

export function logged() {
    const navigationEntry = {
        moduleName: "views/tabs/home/home-fragment",
        context: {"token": instagramToken},
        animated: false,
        clearHistory: true
        };
    return frameModule.topmost().navigate(navigationEntry);
}

export function back() {
    instagramToken = "";
    const navigationEntry = {
        moduleName: "views/tabs/tabs-page",
        context: {"token": instagramToken},
        animated: false,
        clearHistory: true
    };
    return frameModule.topmost().navigate(navigationEntry);
}
