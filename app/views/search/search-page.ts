import { EventData, Observable } from "data/observable";
import { ObservableArray } from "data/observable-array";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import * as frameModule from "ui/frame";
import { BackendService } from "../../shared/services/backend.service";
import { SearchViewModel } from "./search-view-model";
import view = require("ui/core/view");
import { Image } from "tns-core-modules/ui/image/image";


const searchViewModel = new SearchViewModel();

export function onLoaded(args: EventData) {
    const component = <StackLayout>args.object;
    component.bindingContext = searchViewModel;

    // const imageA = <Image>view.getViewById(component, "imageA");
    // searchViewModel.passImg(imageA);
}
