import { getString, setString } from "application-settings";
import * as fs from "tns-core-modules/file-system";
import firebase = require("nativescript-plugin-firebase");
import { Observable } from "tns-core-modules/ui/page/page";
import { User } from "./../../shared/user.model";

const tokenKey = "token";
let user = new User();

export class BackendService {
	// public static user: User;

	// init
	static init(): Promise<any> {
		return firebase.init({
			storageBucket: "gs://aspireapp-2dff5.appspot.com",
			persist: true,
			onAuthStateChanged(data) { // optional but useful to immediately re-logon the user when he re-visits your app
				console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
				if (data.loggedIn) {
					this.token = data.user.uid;
					BackendService.getThisUserCollection();
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

	static printUser() {
		console.dir(user);
	}

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
			console.log("New user created: " + response.key);
			this.token = response.key;
			user.uid = response.key;
			this.doUserStore(user);
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
			this.token = response.uid;
			BackendService.getThisUserCollection();

			return response;
			});
	}

	static logout() {
	return firebase.logout().then(() => this.token = "");
	}

	static doDeleteUser(): Promise<any> {
		return firebase.deleteUser().then(
			() => {
				this.deleteThisUserCollection();
				this.token = "";
			  	alert({
					title: "User deleted",
					okButtonText: "Nice!"
				});
				return true
			},
			errorMessage => {
			  	alert({
					title: "User not deleted",
					message: errorMessage,
					okButtonText: "OK, got it"
				  });
				  return false
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

	static doUserStore(user: User) {
		return firebase.setValue(
			'/users/' + user.uid,
			{
			'username': user.username,
			'uid': user.uid,
			'email': user.email,
			'bio': user.bio,
			'birthYear': user.birthYear,
			'gender': user.gender,
			'imageList': user.imageList
			}
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

	static getUsersCollection(): Promise<User[]> {
		return firebase.getValue('/users')
		.then(result => {
			const users = new Array<User>();
			for (var key in result.value) {
				console.log("Key: " + key);
				console.log("Value: " + result.value[key]);
				users.push(result.value[key]);
			}
			return users
		})
		.catch(error => {
			console.log("Error: " + error)
			return null
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

	static getThisUserCollection(): Promise<User> {
		return firebase.getValue('/users/' + this.token)
		.then(result => {
			return <User> result.value
		})
		.catch(error => {
			console.log("Error: " + error)
			return null
		});
	}

	static addToImageList(remoteLocation: string, filename: string): Promise<User> {
		return firebase.setValue(
			'/users/' + this.token + "/imageList/" + filename,
			{
			'remoteLocation': remoteLocation,
			'public': true
			})
	}

	static doUserStoreByPush(user: User): Promise<any> {
		return firebase.push(
			'/users/',
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

	// static getAllUsers() {
	// 	const usersCollection = firebase.firestore().collection("users");

	// 	usersCollection.get().then(querySnapshot => {
	// 	querySnapshot.forEach(doc => {
	// 		console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
	// 	});
	// 	});
	// }

	// static addUser(user: User) {
	// 	const usersCollection = firebase.firestore().collection("users");
	// 	usersCollection.set(this.token).add({
	// 		username: user.username,
	// 		email: user.email,
	// 		bio: user.bio,
	// 		birthYear: user.birthYear,
	// 		gender: user.gender,
	// 		imageList: user.imageList
	// 	  }).then(documentRef => {
	// 		console.log(`San Francisco added with auto-generated ID: ${documentRef.id}`);
	// 	  });
	// }

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
		}).then((uploadedFile) => {
				console.log("File uploaded: " + JSON.stringify(uploadedFile));
				// // make reference in database
				// firebase.setValue('/users/' + this.token + "/imageList",
				// {
				// 	"filename": localPath.split("/").pop(),
				// 	"public": true // for now
				// })

				return uploadedFile;
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
