import { EventData } from "data/observable";
import { StackLayout } from "ui/layouts/stack-layout";
import { HomeViewModel } from "./home-view-model";
import * as utils from "utils/utils";

export function onLoaded(args: EventData) {
    const component = <StackLayout>args.object;
    component.bindingContext = new HomeViewModel();
    utils.ad.dismissSoftInput();
}
