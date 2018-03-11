import { Observable } from "data/observable";
import * as dialogs from "ui/dialogs";
import { InstaImage } from "../../shared/services/instagram.service";
import { BackendService } from "../../shared/services/backend.service";
import * as Toast from "nativescript-toast";
import { topmost } from "ui/frame";
import { CustomImage } from "../../shared/user.model";

/* ***********************************************************
* This is the item details view model.
*************************************************************/
export class ImageDetailViewModel extends Observable {
    constructor(private _instaImage: CustomImage) {
        super();
    } // TODO make difference between instagram and uploaded pictures

    get instaImage(): CustomImage {
        return this._instaImage;
    }

    public deleteImg() {
        dialogs.confirm({
            title: "Delete this pic?",
            message: this.instaImage.id,
            okButtonText: "Delete",
            cancelButtonText: "Cancel"
        })
        .then(result => {
            if (result) {
                BackendService.deleteFile(this.instaImage.remoteLocation)
                .then(result => {
                    if (result) {
                        BackendService.removeImageFromList(this.instaImage.id).then(() => {
                            Toast.makeText("Deleted: " + this.instaImage.id).show();
                            topmost().goBack();
                        });
                    }
                });
            }
        });
    }

    public onBackButtonTap(): void {
        return topmost().goBack();
    }
}
