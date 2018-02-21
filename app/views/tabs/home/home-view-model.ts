import { Observable } from "data/observable";
import { Image } from "ui/image";
import { ObservableProperty } from "../../../shared/observable-property-decorator";

export class HomeViewModel extends Observable {
    @ObservableProperty() img: Image;

    constructor() {
        super();
    }

}
