import firebase = require("nativescript-plugin-firebase");
import { SelectedIndexChangedEventData, TabView, TabViewItem } from "tns-core-modules/ui/tab-view";
import view = require("ui/core/view");
import * as dialogs from "ui/dialogs";
import * as frameModule from "ui/frame";
import label = require("ui/label");
import { NavigatedData, Page } from "ui/page";
import { BackendService } from "./../../shared/services/backend.service";
import { User } from "./../../shared/user.model";
import { TabsViewModel } from "./tabs-view-model";

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize data for the whole tab
* navigation layout as a whole.
*************************************************************/
export function onNavigatingTo(args: NavigatedData) {
    /* ***********************************************************
    * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
    * Skipping the re-initialization on back navigation means the user will see the
    * page in the same data state that he left it in before navigating.
    *************************************************************/
    if (args.isBackNavigation) {
        return;
    }

    const page = <Page>args.object;
    page.bindingContext = new TabsViewModel();

    if (!BackendService.isLoggedIn()) {
        return frameModule.topmost().navigate("views/login/login");
    } else {
        const charCode = 0xf2bd;
        const usernameLabel = <label.Label>view.getViewById(page, "username");
        firebase.getCurrentUser().then((user) => {
            usernameLabel.text =  user.email.split("@")[0] + " " + String.fromCharCode(charCode);
        });
    }
}

/* ***********************************************************
* Get the current tab view title and set it as an ActionBar title.
* Learn more about the onSelectedIndexChanged event here:
* https://docs.nativescript.org/cookbook/ui/tab-view#using-selectedindexchanged-event-from-xml
*************************************************************/
export function onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
    const tabView = <TabView>args.object;
    const bindingContext = <TabsViewModel>tabView.bindingContext;
    const selectedTabViewItem = tabView.items[args.newIndex];

    bindingContext.title = selectedTabViewItem.title;
}

export function logOut() {
    BackendService.logout()
    .then(() => {
        frameModule.topmost().navigate("views/login/login");
    });
}

export function deleteUser() {
    BackendService.removeUser();
}

export function refreshTabsPage() {
    console.log("Refresh");

    return frameModule.topmost().navigate("views/tabs/tabs-page");
}
