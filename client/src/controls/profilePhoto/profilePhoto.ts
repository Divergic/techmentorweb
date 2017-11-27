import AuthComponent from "../../components/authComponent";
import FileUpload from "vue-upload-component";
import { Component, Prop } from "vue-property-decorator";
import { AccountProfile } from "../../services/api/accountProfileService";
import { IPhotoConfig, PhotoConfig } from "../../services/config/photoConfig";
import { INotify, Notify } from "../../services/notify";
import store from "store";

const noPhotoModule = require("../../images/no_photo.svg");

@Component({
    components: {
      FileUpload
    }
  })
export default class ProfilePhoto extends AuthComponent {
    public photoConfig: IPhotoConfig;
    private notify: INotify;

    // View binding properties
    public photoUploadProgress: number | null = null;
    public photoUri: string | null = null;
    public noPhoto = noPhotoModule;
    public uploadingPhoto: boolean = false;

    @Prop()
    public model: AccountProfile;
    
    public constructor() {
        super();

        this.photoConfig = new PhotoConfig();
        this.notify = new Notify();
    }

    public configure(photoConfig: IPhotoConfig, notify: INotify) {
        this.photoConfig = photoConfig;
        this.notify = notify;
    }

    public mounted(): void {
        this.OnLoad();
    }

    public OnLoad(): void {
        this.BuildPhotoUri();
    }

    public OnPhotoSelect(): void {
        let file = document.getElementById("photofile");
        
        if (!file) {
            return;
        }
        
        file.click();
    }
    
    public OnPhotoRemove(): void {
        this.model.photoHash = null;
        this.model.photoId = null;
        this.photoUri = null;

        this.notify.showInformation("Your photo has been removed. Don't forget to save your profile.");
    }

    public OnPhotoFilter(newFile, oldFile, prevent): void {
        if (!newFile) {
            return;
        }

        if (newFile && !oldFile) {
            const maxKb = 256;
            const failureMessage = "Please select a jpg/jpeg or png that is less than " + maxKb + "kb.";

            if (newFile.size > (maxKb * 1024)) {
                this.notify.showError(failureMessage);

                return prevent();
            }

            if (!/\.(jpg|jpeg|png)$/i.test(newFile.name)) {
                this.notify.showError(failureMessage);

                return prevent();
            }
        }

        if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
            newFile.url = "";
            
            let URL = window.URL || (<any>window).webkitURL;

            if (URL && URL.createObjectURL) {
                newFile.url = URL.createObjectURL(newFile.file);
            }
        }
    }

    public OnPhotoUploaded(newFile, oldFile): void {
        if (!newFile) {
            return;
        }

        let progress: number = 0;

        if (newFile.progress) {
            progress = parseInt(newFile.progress);
        }

        if (!newFile.active
            && progress === 0) {
            this.uploadingPhoto = true;
            newFile.active = true;
        }

        this.photoUploadProgress = progress;
        
        // Check if the upload has hit a 401
        if (newFile.xhr
            && newFile.xhr.status) {
             if (newFile.xhr.status === 401) {
                // Looks like the users authentication session has expired

                // Temporarily store the model to handle scenarios where the auth token has expired
                // We don't want the user to loose their changes with an auth refresh
                store.set("profile", this.model);
                
                // Sign in again
                this.signIn();
            } else if (this.photoUploadProgress === 100 
                && !newFile.active && newFile.xhr.status === 201) {
                // The upload has completed successfully
                this.photoUploadProgress = null;
    
                // Get response data
                this.model.photoId = newFile.response.id;
                this.model.photoHash = newFile.response.hash;
    
                this.BuildPhotoUri();
                
                this.uploadingPhoto = false;
                this.notify.showSuccess("Successfully uploaded your photo. Don't forget to save your profile.");
            } else if (newFile.xhr.status !== 201) {
                // If this is 201 here then it is an event fired that we don't want to respond to
                this.uploadingPhoto = false;
                this.notify.showError("Failed to upload your photo. Please try again.");
            }
        }
    }

    private BuildPhotoUri(): void {
        if (!this.model.photoId) {
            this.photoUri = null;

            return;
        }

        let uri = this.photoConfig.GetPhotoUri(this.model.id, this.model.photoId, this.model.photoHash);

        this.photoUri = uri;
    }
}