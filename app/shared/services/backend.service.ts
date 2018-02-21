import { getString, setString } from "application-settings";
import * as fs from "tns-core-modules/file-system";
import firebase = require("nativescript-plugin-firebase");
import { Observable } from "tns-core-modules/ui/page/page";
import { User } from "./../../shared/user.model";
import { Config } from "./../config";

const tokenKey = "token";

export class BackendService {

	static isLoggedIn(): boolean {
		return !!getString("token");
	}

	static get token(): string {
		return getString("token");
	}

	static set token(theToken: string) {
		setString("token", theToken);
	}

	static register(user: User) {
		return firebase.createUser({
			email: user.email,
			password: user.password
		}).then((response) => {
			console.log(JSON.stringify(response));

			return response;
			}
		).catch((error) => {
			console.log(error);
		});
		}

		static updateUser(user: User) {
		firebase.updateProfile({
			displayName: user.username
		}).then(() => {
				// called when update profile was successful
			},
			(errorMessage) => {
				console.log(errorMessage);
			}
		);
	}

	static login(user: User) {
		return firebase.login({
			type: firebase.LoginType.PASSWORD,
			passwordOptions: {
			email: user.email,
			password: user.password
			}
		}).then((response) => {
			console.log(JSON.stringify(response));
			Config.token = response.uid;
			BackendService.token = response.uid;

			return response;
			});
	}

	static logout() {
	Config.token = "";
	BackendService.token = "";

	return firebase.logout();
	}

	static uploadFile(remoteFullPath: string, localPath: string): Promise<any> {
		const appPath = fs.knownFolders.currentApp();
		const localFullPath = fs.path.join(appPath.path, localPath);
		if (!fs.File.exists(localFullPath)) {
			console.log("File does not exist");
			return null
		}
		console.log("localFullPath: " + localFullPath);
		
		return firebase.uploadFile({
			remoteFullPath,
			localFullPath,
			onProgress: status => {
				console.log("Uploaded fraction: " + status.fractionCompleted);
				console.log("Percentage complete: " + status.percentageCompleted);
			}	
		}).then((uploadedFile) => {
				console.log("File uploaded: " + JSON.stringify(uploadedFile));
				return uploadedFile
		},
		(error) => {
			console.log("File upload error: " + error);
		});
	}

	static downloadFile(remoteFullPath: string, localPath: string): Promise<any> {
		const appPath = fs.knownFolders.currentApp();
		const localFullPath = fs.path.join(appPath.path, localPath);
		return firebase.downloadFile({
			remoteFullPath,
			localFullPath
		}).then(
			function (downloadedFile) {
				console.log("File downloaded to the requested location");
				console.log(JSON.stringify(downloadedFile));
			},
			function (error) {
				console.log("File download error: " + error);
			}
		);
	}

	static getDownloadUrl(remoteFullPath: string): Promise<any> {
		return firebase.getDownloadUrl({
		remoteFullPath
		})
		.then((url: string) => {
			return url;
		},
		(errorMessage: any) => {
			console.log(errorMessage);
		});
	}

}
