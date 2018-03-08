import { EventData } from "data/observable";
import { Page, NavigatedData } from "ui/page";
import { LoginModel } from "./login-model";


export function onLoaded(args) {
    const page = <Page>args.object;
    page.bindingContext = new LoginModel();
}

export function pageNavigatedTo(args: NavigatedData): void {
    if (args.isBackNavigation) {
        return;
    }

    const page: Page = <Page>args.object;
    page.bindingContext = new LoginModel();
}

