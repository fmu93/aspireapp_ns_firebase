import { EventData, Observable } from "data/observable";
import { ObservableArray } from "data/observable-array";
import * as Toast from "nativescript-toast";
import view = require("ui/core/view");
import * as frameModule from "ui/frame";
import { StackLayout } from "ui/layouts/stack-layout";
import { BackendService } from "../../../shared/services/backend.service";
import { User } from "../../../shared/user.model";
import { BrowseViewModel } from "./browse-view-model";

let users = new ObservableArray<User>();
let isLoading: boolean = false;
const tmobservable = new Observable();
let component;

export function onLoaded(args: EventData) {
    component = <StackLayout>args.object;
    component.bindingContext = new BrowseViewModel();
}

export function lookUp() {
    // isLoading = true;
    // BackendService.customEndPoint("look-up", {})
    // .then((response: Array<User>) => {
    //     users = new ObservableArray(response);
    //     tmobservable.set("users", users);
    //     component.bindingContext = tmobservable;
    //     isLoading = false;
    //     console.log("Finished lookup");
    //     Toast.makeText("Other users loaded").show();
    // })
    // .catch((error) => {
    //     console.log(error);
    //     isLoading = false;
    // });

}
