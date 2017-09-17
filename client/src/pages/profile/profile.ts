import Component from "vue-class-component";
import AuthComponent from "../../components/authComponent";
import { IProfileService, ProfileService, UserProfile } from "../../services/api/profileService";
import Failure from "../../services/failure";
import { INotify, Notify } from "../../services/notify";
import { IListsService, ListsService, ListItem } from "../../services/lists"
import store from "store";

@Component
export default class Profile extends AuthComponent {
    private profileService: IProfileService;
    private listsService: IListsService;
    private notify: INotify;

    // Properties for view binding
    private loading: boolean = true;
    private model: UserProfile = new UserProfile();
    private timezones: Array<ListItem<string>> = new Array<ListItem<string>>();
    private birthYears: Array<ListItem<number>> = new Array<ListItem<number>>();
    private genders: Array<ListItem<string>> = new Array<ListItem<string>>();
    private statuses: Array<ListItem<string>> = new Array<ListItem<string>>();
    private startedInTechYears: Array<ListItem<number>> = new Array<ListItem<number>>();

    public constructor() {
        super();
        
        this.profileService = new ProfileService();
        this.listsService = new ListsService();
        this.notify = new Notify();
    }
    
    public mounted(): Promise<void> {
        return this.OnLoad();
    }

    public async OnLoad(): Promise<void> {
        this.timezones = this.listsService.getTimezones();
        this.birthYears = this.listsService.getBirthYears();
        this.startedInTechYears = this.listsService.getTechYears();
        this.statuses = this.listsService.getProfileStatuses();
        this.genders = this.listsService.getGenders();

        await this.loadProfile();

        this.loading = false;
    }

    public async OnSave(): Promise<void> {
        let isValid = await this.$validator.validateAll();

        if (!isValid) {
            this.notify.showWarning("Oh no, there are some errors on the form. Please fix these and try again.");
            
            return;
        }

        // Temporarily store the model to handle scenarios where the auth token has expired
        // We don't want the user to loose their changes with an auth refresh
        store.set("profile", this.model);

        try {
            await this.profileService.updateAccountProfile(this.model);
            
            store.remove("profile");
            
            this.notify.showSuccess("Your profile has been updated.");        
        }
        catch (failure) {
            // Check Failure.visibleToUser
            if (failure.visibleToUser) {
                this.notify.showFailure(<Failure>failure);
            } else {
                throw failure;
            }
        }
    }

    public isBanned(): boolean {
        if (this.loading) {
            return false;
        }

        if (this.model.bannedAt) {
            return true;
        }
        
        return false;
    }

    public ShowWebsite(uri: string): void {
        window.open(uri, '_blank');
    }

    public configure(profileService: IProfileService, listsService: IListsService, notify: INotify) {
        this.profileService = profileService;
        this.listsService = listsService;
        this.notify = notify;
    }

    private async loadProfile(): Promise<void> {
        try {
            // Get the profile stored before an auth refresh or create a new one
            let cachedProfile: UserProfile = <UserProfile>store.get("profile");

            if (cachedProfile) {
                this.model = cachedProfile;
                
                this.notify.showInformation("Your authentication session had expired.<br />Please try saving your profile again.");
    
                store.remove("profile");
            }
            else {
                this.model = await this.profileService.getAccountProfile();
            }

            // Populate first name, last name and email from data store if the values are not found
            if (!this.model.email) {
                this.model.email = this.$store.getters["email"];
            }

            if (!this.model.firstName) {
                this.model.firstName = this.$store.getters["firstName"];
            }

            if (!this.model.lastName) {
                this.model.lastName = this.$store.getters["lastName"];
            }

            // Add default values when missing to fields that should be bound to lists that provide an unspecified value
            // The reason for this is that the model from the API will have these fields missing from the JSON
            // but we want the select lists to default to the Unspecified value. We need to trigger this binding
            // by pushing a value onto the properties that match the Unspecified value in the select.
            if (!this.model.gender) {
                this.model.gender = <string><any>null;
            }

            if (!this.model.birthYear) {
                this.model.birthYear = <number><any>null;
            }

            if (!this.model.yearStartedInTech) {
                this.model.yearStartedInTech = <number><any>null;
            }

            if (!this.model.timeZone) {
                this.model.timeZone = <string><any>null;
            }
            
            if (!this.model.website) {
                this.model.website = <string><any>null;
            }
            
            if (!this.model.gitHubUsername) {
                this.model.gitHubUsername = <string><any>null;
            }
            
            if (!this.model.twitterUsername) {
                this.model.twitterUsername = <string><any>null;
            }
        }
        catch (failure) {
            // Check Failure.visibleToUser
            if (failure.visibleToUser) {
                this.notify.showFailure(<Failure>failure);
            } else {
                throw failure;
            }
        }
    }
}