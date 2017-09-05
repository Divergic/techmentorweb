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
    private model: UserProfile = new UserProfile();
    private timezones: Array<ListItem<string>> = new Array<ListItem<string>>();
    private birthYears: Array<ListItem<number>> = new Array<ListItem<number>>();
    private genders: Array<ListItem<string>> = new Array<ListItem<string>>();
    private statuses: Array<ListItem<number>> = new Array<ListItem<number>>();
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

    public OnLoad(): Promise<void> {
        // Get the profile stored before an auth refresh or create a new one
        let cachedProfile: UserProfile = <UserProfile>store.get("profile");
        
        if (cachedProfile) {
            this.model = cachedProfile;
            
            this.notify.showInformation("Your authentication session had expired.<br />Please try saving your profile again.");

            store.remove("profile");
        }

        this.timezones = this.listsService.getTimezones();
        this.birthYears = this.listsService.getBirthYears();
        this.startedInTechYears = this.listsService.getTechYears();
        this.statuses = this.listsService.getProfileStatuses();
        this.genders = this.listsService.getGenders();
        
        // TODO: Add loading indicator support
        return this.load();
    }

    public OnSave(): void {
        // Temporarily store the model to handle scenarios where the auth token has expired
        // We don't want the user to loose their changes with an auth refresh
        store.set("profile", this.model);

        try {
            console.table(this.model);
            
            store.remove("profile");
        }
        catch (error) {
            // TODO: Catch authentication token expiry and call sign in again
        }
    }

    public configure(profileService: IProfileService, listsService: IListsService, notify: INotify) {
        this.profileService = profileService;
        this.listsService = listsService;
        this.notify = notify;
    }

    async load(): Promise<void> {
        try {
            this.model = await this.profileService.getUserProfile();
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