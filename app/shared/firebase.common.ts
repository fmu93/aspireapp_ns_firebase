import firebase = require("nativescript-plugin-firebase");
import { Config } from "./config";
import { BackendService } from "./services/backend.service";

console.log(Config.storageBucket)

firebase.init({
    storageBucket: "gs://aspireapp-2dff5.appspot.com",
    onAuthStateChanged(data) { // optional but useful to immediately re-logon the user when he re-visits your app
        console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
        if (data.loggedIn) {
            BackendService.token = data.user.uid;
            Config.token = data.user.uid;
            console.log("user's email address: " + (data.user.email ? data.user.email : "N/A"));
        } else {
            BackendService.token = "";
        }
    }
    })
    .then((instance) => console.log("firebase.init done"),
    (error) => console.log("firebase.init error: " + error));
