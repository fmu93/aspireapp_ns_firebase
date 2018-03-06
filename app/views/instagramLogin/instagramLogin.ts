import view = require("ui/core/view");
import { Page } from "ui/page";
import { instagramLoginModel } from "./instagramLogin-model";
import {WebView, LoadEventData} from "ui/web-view";
import * as frameModule from "ui/frame";
import * as dialogs from "ui/dialogs";
import { BackendService } from "./../../shared/services/backend.service";
import { InstagramService } from "./../../shared/services/instagram.service";
import * as http from "http";
import app = require("application");

let webView = new WebView();
let instaToken = "";

export function onLoaded(args) {

    const page = <Page>args.object;
    page.bindingContext = new instagramLoginModel();
    webView = <WebView>view.getViewById(page, "webView");
    const ws = webView.android.getSettings();
    loadUrl();
}

export function loadUrl() {
    // Open the Auth flow in a popup.
    const url = "https://api.instagram.com/oauth/authorize/?client_id=ada6cfdfd31547eba0c005834067b9c4&redirect_uri=https://aspireapp-2dff5.appspot.com/instagram-callback&response_type=token";
    
    webView.src = url;
    webView.on(WebView.loadFinishedEvent, function (args: LoadEventData) {
        // (<WebView>args.object).stopLoading();
        if (args.url && args.url.includes("access_token=")) {
            // update instagram token for user
            instaToken = args.url.split("access_token=").pop();
            InstagramService.updateFirebaseUser(instaToken);
            webView.off(WebView.loadFinishedEvent);
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
        moduleName: "views/home/home-page",
        context: {"token": instaToken},
        animated: false,
        clearHistory: true
        };
    return frameModule.topmost().navigate(navigationEntry);
}

export function back() {
    const navigationEntry = {
        moduleName: "views/settings/settings-page",
        context: {"token": instaToken},
        animated: false,
        clearHistory: true
    };
    return frameModule.topmost().navigate(navigationEntry);
}

export function clearCookies(args: WebView) {
    if (args.android) {
        // args.android.nativeApp.webkit.WebView;
    } else if (args.ios) {
        // UIWebView;
    }
}

