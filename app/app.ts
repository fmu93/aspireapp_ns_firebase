/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as app from "application";
import "./bundle-config";
import { BackendService } from "./shared/services/backend.service";
// import * as strings from "./shared/strings";

BackendService.init();

app.start({ moduleName: "views/tabs/tabs-page" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
