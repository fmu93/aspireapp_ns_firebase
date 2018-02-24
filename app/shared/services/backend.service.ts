import { getString, setString } from "application-settings";
import * as fs from "tns-core-modules/file-system";
import firebase = require("nativescript-plugin-firebase");
import { Observable } from "tns-core-modules/ui/page/page";
import { User } from "./../../shared/user.model";

const tokenKey = "token";

export class BackendService {

	// init
	static init(): Promise<any> {
		return firebase.init({
			storageBucket: "gs://aspireapp-2dff5.appspot.com",
			persist: true,
			onAuthStateChanged(data) { // optional but useful to immediately re-logon the user when he re-visits your app
				console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
				if (data.loggedIn) {
					this.token = data.user.uid;
					console.log("user's email address: " + (data.user.email ? data.user.email : "N/A"));
				} else {
					this.token = "";
				}
			}
		})
		.then((instance) => console.log("firebase.init done"),
		(error) => console.log("firebase.init error: " + error));
	}

	// User auth stuff

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
			this.doUserStoreByPush(user);
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
			BackendService.token = response.uid;

			return response;
			});
	}

	static logout() {
	BackendService.token = "";

	return firebase.logout();
	}

	static doDeleteUser(): Promise<any> {
		return firebase.deleteUser().then(
			() => {
				BackendService.token = "";
			  	alert({
					title: "User deleted",
					okButtonText: "Nice!"
			  	});
			},
			errorMessage => {
			  	alert({
					title: "User not deleted",
					message: errorMessage,
					okButtonText: "OK, got it"
			  	});
			}
		);
	  }

	static doGetCurrentUser(): firebase.User {
		firebase.getCurrentUser().then(
			result => {
			alert({
				title: "Current user",
				message: JSON.stringify(result),
				okButtonText: "Nice!"
			});
			return result
			},
			errorMessage => {
			  	alert({
					title: "No current user",
					message: errorMessage,
					okButtonText: "OK, thanks"
			  	});	
			}
		);
		return null
	}

	// Other auth methods

	static doLoginByFacebook(): void {
		firebase.login({
		  // note that you need to enable Facebook auth in your firebase instance
		  type: firebase.LoginType.FACEBOOK
		}).then(
			result => {
			  alert({
				title: "Login OK",
				message: JSON.stringify(result),
				okButtonText: "Nice!"
			  });
			},
			errorMessage => {
			  alert({
				title: "Login error",
				message: errorMessage,
				okButtonText: "OK, pity"
			  });
			}
		);
	}

	static doLoginByGoogle(): void {
		firebase.login({
		  // note that you need to enable Google auth in your firebase instance
		type: firebase.LoginType.GOOGLE
		}).then(
			result => {
			  alert({
				title: "Login OK",
				message: JSON.stringify(result),
				okButtonText: "Nice!"
			  });
			},
			errorMessage => {
			  alert({
				title: "Login error",
				message: errorMessage,
				okButtonText: "OK, pity"
			  });
			}
		);
	}

	// database stuff

	static doUserStoreByPush(user: User): Promise<any> {
		return firebase.push(
			'/users/' + this.token,
			{
			'username': user.username,
			'email': user.email,
			'bio': user.bio,
			'birthYear': user.birthYear,
			'gender': user.gender,
			'imageList': user.imageList
			}
		).then(
			result => {
			console.log("firebase.push done, created key: " + result.key);
			},
			error => {
			console.log("firebase.push error: " + error);
			}
		);
	}

	// Storage stuff

	static uploadFile(remoteFullPath: string, localPath: string): Promise<any> {
		const appPath = fs.knownFolders.currentApp();
		// const localFullPath = fs.path.join(appPath.path, localPath); // seems like whould be localPath
		if (!fs.File.exists(localPath)) {
			console.log("File does not exist: " + localPath);
			return null;
		}
		
		return firebase.uploadFile({
			remoteFullPath,
			localFullPath: localPath,
			onProgress: status => {
				console.log("Uploaded fraction: " + status.fractionCompleted);
				console.log("Percentage complete: " + status.percentageCompleted);
			}	
		}).then((uploadedFile) => {
				console.log("File uploaded: " + JSON.stringify(uploadedFile));
				return uploadedFile;
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

	static deleteFile(remoteFullPath: string): void {
		firebase.deleteFile({
			remoteFullPath
		}).then(
			function () {
				console.log("File deleted.");
			},
			function (error) {
				console.log("File deletion Error: " + error);
			}
		);
	}  

	// Tools/utils

	static makeImgRemotePath(fileName: string, extension: string): string {
		return "/users/" + BackendService.token + "/public/" + fileName + "." + extension.replace(".", "");
	}

}
