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
    public instaImageList: Array<InstaImage>;

    constructor() {
        super();
    }
}

export class ExtendedUser extends InstagramUser {
    public imageList: Array<ImageCustom>;

    constructor() {
        super();
    }
}

export class ImageCustom extends Observable {
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
    public user: {
        username: string,
        profile_picture: string,
        id: string
    };
    public created_time: string;
    public images: {
        low_resolution: {
            url: string,
            width: number,
            height: number
        },
        thumbnail: {
            url: string,
            width: number,
            height: number
        },
        standard_resolution: {
            url: string,
            width: number,
            height: number
        }
    };
    public type: string;
    public users_in_photo: [string];
    public tags: [string];
    public id: string;
    public location: {
        latitude: number,
        longitude: number,
        id: string,
        street_address: string,
        name: string
    };
    public public: boolean = false;
    public remoteLocation: string;
    public contentType: string; //image/jpeg
    public updated_time: string; //2018-02-27T12:08:43.752Z
    public size: number; // 22393

    constructor (id: string, remoteFullPath: string, uploadResult: FileUploadedResult) {
        super();
        this.id = id;
        this.remoteLocation = remoteFullPath;
        this.created_time = uploadResult.created;
        this.contentType = uploadResult.contentType;
        this.updated_time = uploadResult.updated;
        this.size = uploadResult.size;
        this.images.standard_resolution.url = uploadResult.url;
        console.log(JSON.stringify(this));
    }
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
    public location: {
        latitude: number,
        longitude: number,
        id: string,
        street_address: string,
        name: string
    };

    constructor() {
    }
}
