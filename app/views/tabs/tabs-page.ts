import firebase = require("nativescript-plugin-firebase");
import { SelectedIndexChangedEventData, TabView, TabViewItem } from "tns-core-modules/ui/tab-view";
import view = require("ui/core/view");
import * as dialogs from "ui/dialogs";
import * as frameModule from "ui/frame";
import label = require("ui/label");
import { NavigatedData, Page } from "ui/page";
import { BackendService } from "./../../shared/services/backend.service";
import { TabsViewModel } from "./tabs-view-model";
import * as utils from "utils/utils";


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
        console.log(BackendService.isLoggedIn());
        return frameModule.topmost().navigate("views/login/login");
    } else {
        utils.ad.dismissSoftInput();
        const charCode = 0xf2bd;
        const usernameLabel = <label.Label>view.getViewById(page, "username");
        BackendService.getThisUserCollection().then((user) => {
            usernameLabel.text =  user.username + " " + String.fromCharCode(charCode);
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
    utils.ad.dismissSoftInput();
}


