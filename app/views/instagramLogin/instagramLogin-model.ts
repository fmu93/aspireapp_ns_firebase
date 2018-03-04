import { Observable } from "tns-core-modules/ui/page/page";

export class instagramLoginModel extends Observable {
    public username: string;
    public password: string;

    constructor() {
        super();
      }
      
}