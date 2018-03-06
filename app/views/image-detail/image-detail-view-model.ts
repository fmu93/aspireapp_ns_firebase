import { Observable } from "data/observable";

import { InstaImage } from "../../shared/services/instagram.service";

/* ***********************************************************
* This is the item details view model.
*************************************************************/
export class ImageDetailViewModel extends Observable {
    constructor(private _instaImage: InstaImage) {
        super();
    }

    get instaImage(): InstaImage {
        return this._instaImage;
    }
}
