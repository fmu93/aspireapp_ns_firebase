import { Page, NavigatedData } from "ui/page";
import { BackendService } from "./../../shared/services/backend.service";
import { topmost } from "ui/frame";

export function onLoaded(args: NavigatedData): void {
    if (args.isBackNavigation) {
        navigateHome();
    }
    
    if (BackendService.isLoggedIn()) {
        loadUser();        
    } else {
        navigateLogin();
    }
}

export function navigateLogin() {
    const navigationEntry = {
        moduleName: "views/login/login",
        backstackVisible: false
    };
    return topmost().navigate(navigationEntry);  
}

export function navigateHome() {
    const navigationEntry = {
        moduleName: "views/home/home-page",
        backstackVisible: false
    };
    return topmost().navigate(navigationEntry);  
}

export function loadUser() {
    BackendService.setUser().then(user => {
        // TODO add loading animation
        if (user) {
            navigateHome();
        } else {
            navigateLogin();
        }
    })
}