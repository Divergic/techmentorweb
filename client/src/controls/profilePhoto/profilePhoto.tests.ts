import ProfilePhoto from "./profilePhoto";
import { IPhotoConfig } from "../../services/config/photoConfig";
import { INotify } from "../../services/notify";
import { AccountProfile } from "../../services/api/accountProfileService";

describe("ProfilePhoto", () => {
    let sut: ProfilePhoto;
    let photoConfig: IPhotoConfig;
    let notify: INotify;
    let photoUri: string;
    let model: AccountProfile;

    beforeEach(() => {
        photoUri = "https://test.techmentors.info/profiles/someprofileid/photos/somephotoid?hash=somehashvalue";        
        model = new AccountProfile(<AccountProfile>{id: "profileId", photoHash: "hash", photoId: "someid"});
        photoConfig = <IPhotoConfig>{
            GetPhotoUri: (profileId: string, photoId: string, hash: string | null): string => {
                return photoUri;
            }
        };
        notify = <INotify>{
            showInformation: (message: string) => {
            },
            showError: (message: string) => {
            },
            showSuccess: (message: string) => {
            }
        };
        sut = new ProfilePhoto();
        
        sut.configure(photoConfig, notify);
        sut.model = model;
        sut.photoUri = photoUri;
    });

    describe("OnLoad", () => {
        it("does not set photoUri when photoId is null", () => {
            model.photoId = null;

            sut.OnLoad();

            expect(sut.photoUri).toBeNull();
        });
        it("set photoUri when photoId found", () => {
            sut.OnLoad();

            expect(sut.photoUri).toEqual(photoUri);
        });
        it("set photoUri using model data", () => {
            spyOn(photoConfig, "GetPhotoUri");

            sut.OnLoad();

            expect(photoConfig.GetPhotoUri).toHaveBeenCalledWith(model.id, model.photoId, model.photoHash);
        });
    });

    describe("OnPhotoSelect", () => {
        it("executes file upload click event", () => {
            let invoked = false;
            let element = {
                click: () => {
                    invoked = true;
                }
            };

            spyOn(document, "getElementById").and.returnValue(element);

            sut.OnPhotoSelect();

            expect(invoked).toBeTruthy();
        });
        it("ignores click when element not found", () => {
            spyOn(document, "getElementById").and.returnValue(null);

            sut.OnPhotoSelect();

            // This should not throw an exception
        });
    });

    describe("OnPhotoRemove", () => {
        it("clears existing model data", () => {
            sut.OnPhotoRemove();

            expect(model.photoId).toBeNull();
            expect(model.photoHash).toBeNull();
        });
        it("clears photo uri", () => {
            sut.OnPhotoRemove();

            expect(sut.photoUri).toBeNull();
        });
        it("raises notification", () => {
            spyOn(notify, "showInformation");

            sut.OnPhotoRemove();

            expect(notify.showInformation).toHaveBeenCalled();
        });
    });

    describe("OnPhotoFilter", () => {
        it("ignores when newFile is null", () => {
            let preventInvoked = false;
            let oldFile = {
            };
            let prevent = () => {
                preventInvoked = true;
            };

            sut.OnPhotoFilter(null, oldFile, prevent);

            expect(preventInvoked).toBeFalsy();
        });
        it("ignores when newFile is undefined", () => {
            let preventInvoked = false;
            let oldFile = {
            };
            let prevent = () => {
                preventInvoked = true;
            };

            sut.OnPhotoFilter(undefined, oldFile, prevent);

            expect(preventInvoked).toBeFalsy();
        });
        it("rejects upload when file too large", () => {
            spyOn(notify, "showError");

            let preventInvoked = false;
            let newFile = {
                size: (256 * 1024) + 1
            };
            let prevent = () => {
                preventInvoked = true;
            };

            sut.OnPhotoFilter(newFile, null, prevent);

            expect(preventInvoked).toBeTruthy();
            expect(notify.showError).toHaveBeenCalled();
        });
        it("allows upload when file is not too large", () => {
            spyOn(notify, "showError");

            let preventInvoked = false;
            let newFile = {
                size: (256 * 1024),
                name: "me.jpg"
            };
            let prevent = () => {
                preventInvoked = true;
            };

            sut.OnPhotoFilter(newFile, null, prevent);

            expect(preventInvoked).toBeFalsy();
            expect(notify.showError).not.toHaveBeenCalled();
        });
        it("rejects upload when file type not supported", () => {
            spyOn(notify, "showError");

            let preventInvoked = false;
            let newFile = {
                size: (256 * 1024),
                name: "me.gif"
            };
            let prevent = () => {
                preventInvoked = true;
            };

            sut.OnPhotoFilter(newFile, null, prevent);

            expect(preventInvoked).toBeTruthy();
            expect(notify.showError).toHaveBeenCalled();
        });
        it("allows upload when file type is jpg", () => {
            spyOn(notify, "showError");

            let preventInvoked = false;
            let newFile = {
                size: (256 * 1024),
                name: "me.jpg"
            };
            let prevent = () => {
                preventInvoked = true;
            };

            sut.OnPhotoFilter(newFile, null, prevent);

            expect(preventInvoked).toBeFalsy();
            expect(notify.showError).not.toHaveBeenCalled();
        });
        it("allows upload when file type is jpeg", () => {
            spyOn(notify, "showError");

            let preventInvoked = false;
            let newFile = {
                size: (256 * 1024),
                name: "me.jpeg"
            };
            let prevent = () => {
                preventInvoked = true;
            };

            sut.OnPhotoFilter(newFile, null, prevent);

            expect(preventInvoked).toBeFalsy();
            expect(notify.showError).not.toHaveBeenCalled();
        });
        it("allows upload when file type is png", () => {
            spyOn(notify, "showError");

            let preventInvoked = false;
            let newFile = {
                size: (256 * 1024),
                name: "me.png"
            };
            let prevent = () => {
                preventInvoked = true;
            };

            sut.OnPhotoFilter(newFile, null, prevent);

            expect(preventInvoked).toBeFalsy();
            expect(notify.showError).not.toHaveBeenCalled();
        });
        it("sets file url from window.URL when new file found", () => {
            let url = "uploadUri";
            let newFile = {
                size: (256 * 1024),
                name: "me.png",
                file: "first",
                url: ""
            };
            spyOn(window.URL, "createObjectURL").and.returnValue(url);

            let prevent = () => {
            };

            sut.OnPhotoFilter(newFile, null, prevent);

            expect(newFile.url).toEqual(url);
        });
        it("sets file url from window.webkitURL when new file found", () => {
            let url = "uploadUri";
            let newFile = {
                size: (256 * 1024),
                name: "me.png",
                file: "first",
                url: ""
            };
            spyOn((<any>window).webkitURL, "createObjectURL").and.returnValue(url);

            let prevent = () => {
            };

            sut.OnPhotoFilter(newFile, null, prevent);

            expect(newFile.url).toEqual(url);
        });
        it("sets file url from window.URL when new file different to old file", () => {
            let url = "uploadUri";
            let newFile = {
                size: (256 * 1024),
                name: "me.png",
                file: "first",
                url: ""
            };
            let oldFile = {
                file: "second"
            };
            spyOn(window.URL, "createObjectURL").and.returnValue(url);

            let prevent = () => {
            };

            sut.OnPhotoFilter(newFile, oldFile, prevent);

            expect(newFile.url).toEqual(url);
        });
        it("sets file url from window.URL when new file different to old file", () => {
            let url = "uploadUri";
            let newFile = {
                size: (256 * 1024),
                name: "me.png",
                file: "first",
                url: ""
            };
            let oldFile = {
                file: "second"
            };
            spyOn((<any>window).webkitURL, "createObjectURL").and.returnValue(url);

            let prevent = () => {
            };

            sut.OnPhotoFilter(newFile, oldFile, prevent);

            expect(newFile.url).toEqual(url);
        });
    });

    describe("OnPhotoUploaded", () => {
        it("does not set progress when new file is null", () => {
            let oldFile = {
            };

            sut.OnPhotoUploaded(null, oldFile);

            expect(sut.photoUploadProgress).toBeNull();
        });
        it("does not set progress when new file is undefined", () => {
            let oldFile = {
            };

            sut.OnPhotoUploaded(undefined, oldFile);

            expect(sut.photoUploadProgress).toBeNull();
        });
        it("sets progress to newFile.progress", () => {
            let newFile = {
                progress: "10"
            };
            let oldFile = {
            };

            sut.OnPhotoUploaded(newFile, oldFile);

            expect(sut.photoUploadProgress).toEqual(10);
        });
        it("activates file upload when new progress found", () => {
            let newFile = {
                active: false,
                progress: 0
            };
            let oldFile = {
            };

            sut.OnPhotoUploaded(newFile, oldFile);

            expect(sut.photoUploadProgress).toEqual(0);
            expect(sut.uploadingPhoto).toBeTruthy();
            expect(newFile.active).toBeTruthy();
        });
        it("stores profile and invokes sign in when 401 returned", () => {
            let newFile = {
                active: false,
                progress: 0,
                xhr: {
                    status: 401
                }
            };
            let oldFile = {
            };

            spyOn(sut, "signIn");
            
            sut.OnPhotoUploaded(newFile, oldFile);

            expect(sut.signIn).toHaveBeenCalled();
        });
        it("marks upload as complete when 201 returned", () => {
            sut.uploadingPhoto = true;
            let newFile = {
                active: false,
                progress: 100,
                xhr: {
                    status: 201
                },
                response: {
                    id: "someid",
                    hash: "somehash"
                }
            };
            let oldFile = {
            };

            spyOn(notify, "showSuccess");
            
            sut.OnPhotoUploaded(newFile, oldFile);

            expect(sut.photoUploadProgress).toBeNull();
            expect(model.photoId).toEqual(newFile.response.id);
            expect(model.photoHash).toEqual(newFile.response.hash);
            expect(sut.photoUri).toEqual(photoUri);
            expect(sut.uploadingPhoto).toBeFalsy();
            expect(notify.showSuccess).toHaveBeenCalled();
        });
        it("marks upload as failed when non-201 returned", () => {
            sut.uploadingPhoto = true;
            let newFile = {
                active: false,
                progress: 0,
                xhr: {
                    status: 500
                }
            };
            let oldFile = {
            };

            spyOn(notify, "showError");
            
            sut.OnPhotoUploaded(newFile, oldFile);

            expect(sut.uploadingPhoto).toBeFalsy();
            expect(notify.showError).toHaveBeenCalled();
        });
    });
});