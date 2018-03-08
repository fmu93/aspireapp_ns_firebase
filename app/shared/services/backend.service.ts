import { getString, setString } from "application-settings";
import * as fs from "tns-core-modules/file-system";
import firebase = require("nativescript-plugin-firebase");
import { Observable } from "tns-core-modules/ui/page/page";
import { BaseUser, InstagramUser, ImageCustom} from "./../../shared/user.model";
import { AddEventListenerResult } from "nativescript-plugin-firebase";

const token = "";

export class BackendService {
	private static userListenerWrapper: AddEventListenerResult;
	private static user: InstagramUser;

	// User model is stored here to be accessed throughout the app

	static getUser(): InstagramUser {
		if (this.user) {
			return this.user;
		} else {
			console.log("Error: User undefined");
			return null;
		}
	}

	static setUser(): Promise<InstagramUser> {
		return this.getThisUserCollection().then(user => {
			if (user) {
				this.user = user;
				console.log("User set: " + this.user.username);
				return this.user;
			} else {
				console.log("Error: User database not available")
				return null
			}
		})
	}

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

	static set token(token: string) {
		setString("token", token);
	}

	static register(user: InstagramUser): Promise<any> {
		return firebase.createUser({
			email: user.email,
			password: user.password
		}).then((response) => {
			console.log("New user created: " + response.key);
			this.token = response.key;
			user.uid = response.key;
			this.doUserStore(user);
			return response;
			}
		).catch((error) => {
			console.log(error);
			return null
		});
	}

	static updateUser(user: InstagramUser) {
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

	static login(user: InstagramUser): Promise<any> {
		return firebase.login({
			type: firebase.LoginType.PASSWORD,
			passwordOptions: {
			email: user.email,
			password: user.password
			}
		}).then((response) => {
			// keep user uid in hand because it is needed to access the user's collection in firebase databse
			this.token = response.uid;
			return response;
		}).catch(error => console.log(error));
	}

	static logout() {
	return firebase.logout().then(() => {
		this.token = ""
	});
	}

	static doDeleteUser(): Promise<any> {
		return firebase.deleteUser().then(() => {
				this.deleteThisUserCollection().then(() => {
					this.deleteFile("users/" + this.token).then(() => {
						this.token = "";
						alert({
							title: "User deleted",
							okButtonText: "Nice!"
						});
						return true
					});
				});
			},
			errorMessage => {
			  	alert({
					title: "User not deleted",
					message: errorMessage,
					okButtonText: "OK, got it"
				  });
				  return false // TODO, check when error on deleting databse and files
			}
		);
	  }

	static getCurrentUser(): Promise<firebase.User> {
		return firebase.getCurrentUser().then(result => {
			return result
			},
			errorMessage => {
			  	alert({
					title: "No current user",
					message: errorMessage,
					okButtonText: "OK, thanks"
				  });	
				return null
			}
		);
	}

	// Other auth methods

	static customLogin(customToken: string): Promise<any> {
		return firebase.login({
		type: firebase.LoginType.CUSTOM,
		customOptions: {
			token: customToken
		}
		}).then(result => {
				JSON.stringify(result);
				this.token = result.uid;
				return result
			},
			function (errorMessage) {
				console.log(errorMessage);
				return null
			}
		);
	}

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

	static doUserStore(user: InstagramUser): Promise<any>  {
		const userDeletedPassword = Object.assign({}, user); 
		userDeletedPassword.password = "<overwritten>";
		return firebase.setValue(
			'/users/' + user.uid,
			userDeletedPassword
		);
	}

	static updateUserProperties(userProperties: {}): Promise<any> {
		return firebase.update(
			'/users/' + this.token,
			userProperties
		);
	}

	static deleteThisUserCollection(): Promise<any> {
		return firebase.remove("/users/" + this.token).then(
			() => {
			  console.log("firebase.remove done");
			},
			error => {
			  console.log("firebase.remove error: " + error);
			}
		);
	}

	static getUsersCollection(): Promise<InstagramUser[]> {
		return firebase.getValue('/users')
		.then(result => {
			const users = new Array<InstagramUser>();
			for (var key in result.value) {
				users.push(result.value[key]);
			}
			return users
		})
		.catch(error => {
			console.log("Error: " + error)
			return error
		});
	}

	static doQueryUsers() {
		const path = "/users";
		const onValueEvent = result => {
			// note that the query returns 1 match at a time,
			// in the order specified in the query
			console.log("Query result: " + JSON.stringify(result));
			if (!result.error) {
				console.log("Event type: " + result.type);
				console.log("Key: " + result.key);
				console.log("Value: " + JSON.stringify(result.value));
			}
		};
		firebase.query(
			onValueEvent,
			path,
			{
				singleEvent: true,
				orderBy: {
					type: firebase.QueryOrderByType.KEY
				}
			}
		).then(
			result => {
			  console.log("This 'result' should be available since singleEvent is true: " + JSON.stringify(result));
			  return result;
			},
			errorMessage => {
				alert({
					title: "Query error",
					message: errorMessage,
					okButtonText: "OK, pity!"
				});
			}
		);
	  }

	static getThisUserCollection(): Promise<InstagramUser> {
		return firebase.getValue('/users/' + this.token)
		.then(result => {
			return <InstagramUser> result.value
		})
		.catch(error => {
			console.log("Error: " + error)
			return null
		});
	}

	static addToImageList(filename: string, remoteLocation: string, url: string): Promise<InstagramUser> {
		const newImage = new ImageCustom(filename, remoteLocation, url);
		return firebase.setValue(
			'/users/' + this.token + "/imageList/" + filename,
			newImage
		)
	}

	static removeImageFromList(filename: string): Promise<any> {
		filename = filename.split(".").shift();
		return firebase.remove('/users/' + this.token + "/imageList/" + filename);
	}

	static addDatabseListener(onChildEvent: any, path: string) {
	  	// listen to changes in the /users path
		firebase.addChildEventListener(onChildEvent, path).then(
			listenerWrapper => {
				this.userListenerWrapper = listenerWrapper;
				var path = listenerWrapper.path;
				var listeners = listenerWrapper.listeners; // an Array of listeners added
				// you can store the wrapper somewhere to later call 'removeEventListeners'
				console.log("firebase.addChildEventListener added");
			},
			error => {
			  console.log("firebase.addChildEventListener error: " + error);
			}
		);
	}

	static enableUsersSync() {
		firebase.keepInSync(
			"/users", // which path in your Firebase needs to be kept in sync?
			true      // set to false to disable this feature again
		).then(
			function () {
			  console.log("firebase.keepInSync is ON for /users");
			},
			function (error) {
			  console.log("firebase.keepInSync error: " + error);
			}
		);
	}

	// Storage stuff

	static uploadFile(remoteFullPath: string, localPath: string): Promise<firebase.UploadFileResult> {
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
		}).then((uploadFileResult) => {
				console.log("File uploaded: " + JSON.stringify(uploadFileResult));
				return uploadFileResult;
		},
		(error) => {
			console.log("File upload error: " + error);
			return null;
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

	static getDownloadUrl(remoteFullPath: string): Promise<string> {
		return firebase.getDownloadUrl({
		remoteFullPath
		})
		.then((url: string) => {
			return url;
		},
		(errorMessage: any) => {
			console.log(errorMessage);
			return errorMessage;
		});
	}

	static deleteFile(remoteFullPath: string): Promise<any> {
		return firebase.deleteFile({
			remoteFullPath
		}).then(result => {
				console.log("File deleted.");
				return result
			},
			error => {
				console.log("File deletion Error: " + error);
			}
		);
	}  

	// Tools/utils

	static makeImgRemotePath(fileName: string, extension: string): string {
		return "/users/" + BackendService.token + "/public/" + fileName + "." + extension.replace(".", "");
	}

}
