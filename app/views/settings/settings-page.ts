import { EventData } from "data/observable";
import { RadSideDrawer } from "nativescript-pro-ui/sidedrawer";
import { topmost } from "ui/frame";
import { NavigatedData, Page } from "ui/page";
import { BackendService } from "./../../shared/services/backend.service";
import { SettingsViewModel } from "./settings-view-model";
import * as dialogs from "ui/dialogs";

export function onNavigatingTo(args: NavigatedData) {
    if (args.isBackNavigation) {
        return;
    }

    const page = <Page>args.object;
    page.bindingContext = new SettingsViewModel();
}

export function onDrawerButtonTap(args: EventData) {
    const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}

export function logOut() {
    dialogs.confirm({
        title: "Log out",
        message: "Are you sure?",
        okButtonText: "Log out",
        cancelButtonText: "Cancel"
    }).then(result => {
        if (result) {
            BackendService.logout()
            .then(() => {
                topmost().navigate("views/login/login");
            });
        }
    });
}

export function deleteUser() {
    dialogs.confirm({
        title: "Delete user",
        message: "Are you sure?",
        okButtonText: "Delete",
        cancelButtonText: "Cancel"
    }).then(result => {
        if (result) {
            BackendService.doDeleteUser().then(deleted => {
                if (deleted) {topmost().navigate("views/login/login");}
            });
        }
    });
    
}

export function bindInstagram() {
    topmost().navigate("views/instagramLogin/instagramLogin");
}