/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as app from "application";
import "./bundle-config";
import { BackendService } from "./shared/services/backend.service";
import fresco = require("nativescript-fresco");
app.setCssFileName("./app.css");

//partial declaration of Fresco native android class
declare module com {
    module facebook {
        module drawee {
            module backends {
                module pipeline {
                    class Fresco {
                        static initialize(context: any): any;
                    }
                }
            }
        }
    }
}

if (app.android) {
    app.on("launch", (intent) => {
        fresco.initialize();
    });
}

BackendService.init();

app.start({ moduleName: "views/tabs/tabs-page" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
