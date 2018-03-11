import { Observable } from "tns-core-modules/ui/page/page";
import { ObservableProperty } from "./observable-property-decorator";
import firebase = require("nativescript-plugin-firebase");
import { BackendService, FileUploadedResult } from "./services/backend.service";
import { InstagramService, InstaMediaList, InstaImage } from "./services/instagram.service";
const validator = require("email-validator");

export class BaseUser extends Observable {
    public username: string;
    public uid: string;
    public email: string;
    public password: string;
    public gender: string;
    public birthYear: number;
    public birthDate: string;
    public type: string;
    public instagramEnabled: boolean;

    constructor() {
        super();
    }

    public isValidEmail() {
        return validator.validate(this.email);
    }
}

export class InstagramUser extends BaseUser {
    // instagram model
    public username: string;
    public instagramToken: string;
    public bio: string;
    public id: string;
    public full_name: string;
    public profile_picture: string;
    public website: string;
    public is_business: boolean;
    public counts: {
        media: number, 
        follows: number, 
        followed_by: number
    }
    public instaImageList: Array<InstaImage> = new Array<InstaImage>();

    constructor() {
        super();
    }
}

export class ExtendedUser extends InstagramUser {
    public imageList: Array<CustomImage> = new Array<CustomImage>();

    constructor() {
        super();
    }
}

export class CustomImage extends Observable {
    public comments: {count: number};
    public caption: {
        created_time: string,
        text: string,
        from: {
            username: string,
            full_name: string,
            type: string,
            id: string
        },
        id: string
    };
    public likes: {
        count: number
    };
    public user_has_liked: boolean;
    public link: string;
    public user = new ImageUser();
    public created_time: string;
    public images = new Images();
    public type: string;
    public users_in_photo: [string];
    public tags: [string];
    public id: string;
    public location = new ImageLocation();
    public public?: boolean = false;
    public remoteLocation?: string;
    public contentType?: string; //image/jpeg
    public updated_time?: string; //seconds
    public size?: number; // 22393

    constructor () {
        super();
    }

    public toUpload(id: string, remoteFullPath: string, uploadResult: FileUploadedResult, user: ExtendedUser) {
        this.id = id;
        this.remoteLocation = remoteFullPath;
        this.user.username = user.username;
        this.user.profile_picture = user.profile_picture;
        this.user.id = user.uid;
        this.created_time = String(Math.floor(new Date(uploadResult.created).getTime()/1000)); // date in seconds
        this.updated_time = this.created_time;
        this.contentType = uploadResult.contentType;
        this.size = uploadResult.size;
        this.images.standard_resolution.url = uploadResult.url;
        this.images.low_resolution.url = uploadResult.url;
    }
}

export class Images {
    public low_resolution = new ImageUrl();
    public thumbnail = new ImageUrl();
    public standard_resolution = new ImageUrl();
}

export class ImageUrl {
    public url: string;
    public width: number;
    public height: number;
}

export class ImageLocation {
    public latitude: number;
    public longitude: number;
    public id: string;
    public street_address: string;
    public name: string;
}

export class ImageUser {
    public username: string;
    public profile_picture: string;
    public id: string;
}

export class Album {
    public caption: {
        created_time: string,
        text: string,
        from: {
            username: string,
            full_name: string,
            type: string,
            id: string
        },
        id: string
    };
    public user: {
        username: string,
        profile_picture: string,
        id: string
    };
    public link: string;
    public created_time: string;
    public type: string;
    public tags: [string];
    public id: string;
    public location = new ImageLocation();

    constructor() {
    }
}
