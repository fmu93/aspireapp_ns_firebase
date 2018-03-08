import { EventData } from "data/observable";
import { StackLayout } from "ui/layouts/stack-layout";
import { HomeViewModel } from "./home-view-model";
import * as utils from "utils/utils";
import { RadSideDrawer } from "nativescript-pro-ui/sidedrawer";
import { topmost } from "ui/frame";
import { BackendService } from "./../../shared/services/backend.service";
import { NavigatedData, Page } from "ui/page";


export function onNavigatingTo(args: NavigatedData) {
    if (args.isBackNavigation) {
        return;
    }

    if (!BackendService.isLoggedIn()) {
        return topmost().navigate("views/login/login");
    }
    
    const page = <Page>args.object;
    page.bindingContext = new HomeViewModel();

}

export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}
