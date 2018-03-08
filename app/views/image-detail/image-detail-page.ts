import { topmost } from "ui/frame";
import { NavigatedData, Page } from "ui/page";

import { ImageDetailViewModel } from "./image-detail-view-model";

/* ***********************************************************
* This is the item details code behind in the master-detail structure.
* This code behind retrieves the passed parameter from the master list component,
* finds the data item by this parameter and displays the detailed data item information.
*************************************************************/

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
export function onNavigatingTo(args: NavigatedData): void {
    if (args.isBackNavigation) {
        return;
    }

    const page = <Page>args.object;
    page.bindingContext = new ImageDetailViewModel(page.navigationContext);
}

/* ***********************************************************
* The back button is essential for a master-detail feature.
*************************************************************/
export function onBackButtonTap(): void {
    return topmost().navigate("views/home/home-page");
}

/* ***********************************************************
* The master-detail template comes with an example of an item edit page.
* Check out the edit page in the /cars/car-detail-edit-page folder.
*************************************************************/
// export function onEditButtonTap(args): void {
//     const bindingContext = <ImageDetailViewModel>args.object.bindingContext;

//     topmost().navigate({
//         moduleName: "home/car-detail-edit-page/car-detail-edit-page",
//         context: bindingContext.instaImage,
//         animated: true,
//         transition: {
//             name: "slideTop",
//             duration: 200,
//             curve: "ease"
//         }
//     });
// }
