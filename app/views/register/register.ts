import { EventData } from "data/observable";
import { RegisterModel } from "./register-model";
import { Page } from "ui/page";


export function onLoaded(args) {
    const page = args.object;
    page.bindingContext = new RegisterModel();
}

export function pageNavigatedTo(args: EventData): void {
    const page: Page = <Page>args.object;
    page.bindingContext = new RegisterModel();
}
