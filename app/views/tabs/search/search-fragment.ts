import { EventData, Observable } from "data/observable";
import { ObservableArray } from "data/observable-array";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import * as frameModule from "ui/frame";
import { BackendService } from "../../../shared/services/backend.service";
import { SearchViewModel } from "./search-view-model";

const members = new ObservableArray<Member>();
const tmobservable = new Observable();

export function onLoaded(args: EventData) {
    const component = <StackLayout>args.object;
    // const dataStore = BackendService.collection2dataStore("memberList");

    // load members data
    // const subscription = dataStore.find()
    // .subscribe((entities: Array<{}>) => {
    //     while (members.length > 0) {
    //         members.pop();
    //     }
    //     let i;
    //     for (i = 0; i < entities.length; i++) {
    //         if ("member" in entities[i]) {
    //             members.push(entities[i]);
    //         }
    //     }
    //     tmobservable.set("memberList", members);
    //     component.bindingContext = tmobservable;

    // }, (error) => {
    //     console.log(error);
    // }, () => {
    //     console.log("Finished pulling member data");
    // });
}

class Member {
    member?: string;
}
