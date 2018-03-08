import { EventData } from "data/observable";
import { Page, NavigatedData } from "ui/page";
import { LoginModel } from "./login-model";
import { BackendService } from "./../../shared/services/backend.service";
import { topmost } from "ui/frame";


// export function onLoaded(args) {
//     if (BackendService.isLoggedIn()) {
//         BackendService.setUser().then(user => {
//             // TODO add loading animation
//             if (user) {
//                 return topmost().navigate("views/home/home-page");  
//             }
//         })
//     } else {
//         const page = <Page>args.object;
//         page.bindingContext = new LoginModel();
//     }
// }

export function pageNavigatedTo(args: NavigatedData): void {
    if (args.isBackNavigation) {
        return;
    }

    if (BackendService.isLoggedIn()) {
        BackendService.setUser().then(user => {
            // TODO add loading animation
            if (user) {
                return topmost().navigate("views/home/home-page");  
            }
        })
    } else {
        const page = <Page>args.object;
        page.bindingContext = new LoginModel();
    }
}

