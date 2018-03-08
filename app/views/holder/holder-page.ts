import { Page, NavigatedData } from "ui/page";
import { BackendService } from "./../../shared/services/backend.service";
import { topmost } from "ui/frame";

export function pageNavigatedTo(args: NavigatedData): void {
    if (BackendService.isLoggedIn()) {
        BackendService.setUser().then(user => {
            // TODO add loading animation
            if (user) {
                const navigationEntry = {
                    moduleName: "views/home/home-page",
                    backstackVisible: false
                };
                return topmost().navigate(navigationEntry);  
            }
        })
    } else {
        const navigationEntry = {
            moduleName: "views/login/login",
            backstackVisible: false
        };
        return topmost().navigate(navigationEntry);  
    }
}