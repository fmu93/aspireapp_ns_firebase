import { EventData } from "data/observable";
import { StackLayout } from "ui/layouts/stack-layout";
import { HomeViewModel } from "./home-view-model";
import * as utils from "utils/utils";
import { RadSideDrawer } from "nativescript-pro-ui/sidedrawer";
import { topmost } from "ui/frame";
import { BackendService } from "./../../shared/services/backend.service";
import { NavigatedData, Page } from "ui/page";
var timer = require("timer");


export function onNavigatingTo(args: NavigatedData) {
    /* ***********************************************************
    * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
    * Skipping the re-initialization on back navigation means the user will see the
    * page in the same data state that he left it in before navigating.
    *************************************************************/
    if (args.isBackNavigation) {
        return;
    }

    if (!BackendService.isLoggedIn()) {
        console.log(BackendService.isLoggedIn());
        return topmost().navigate("views/login/login");
    }
    
    const page = <Page>args.object;
    BackendService.setUser().then(user => {
        // TODO add loading animation
        if (user) {
            page.bindingContext = new HomeViewModel();
        }
    })
}

export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}
