import { EventData, Observable } from "data/observable";
import { ObservableArray } from "data/observable-array";
import * as Toast from "nativescript-toast";
import view = require("ui/core/view");
import * as frameModule from "ui/frame";
import { StackLayout } from "ui/layouts/stack-layout";
import { BackendService } from "../../../shared/services/backend.service";
import { User } from "../../../shared/user.model";
import { BrowseViewModel } from "./browse-view-model";

export function onLoaded(args: EventData) {
    const component = <StackLayout>args.object;
    component.bindingContext = new BrowseViewModel();
}
