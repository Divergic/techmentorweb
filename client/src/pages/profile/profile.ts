import Component from "vue-class-component";
import AuthComponent from "../../components/authComponent";
import Timezones from "tz-ids/index.jsnext.js";
import { IProfileService, ProfileService, UserProfile, ProfileStatus } from "../../services/api/profileService";
import Failure from "../../services/failure";
import { INotify, Notify } from "../../services/notify";
import { IYearsService, YearsService } from "../../services/years"
import store from "store";

class Item<T> {
    public name: string;
    public value?: T;
} 

@Component
export default class Profile extends AuthComponent {
    private profileService: IProfileService;
    private yearsService: IYearsService;
    private model: UserProfile;
    private notify: INotify;
    private timezones: Array<Item<string>>;
    private birthYears: Array<Item<number>>;
    private genders: Array<Item<string>>;
    private statuses: Array<Item<number>>;
    private startedInTechYears: Array<Item<number>>;

    public constructor() {
        super();
        
        // Get the profile stored before an auth refresh or create a new one
        this.model = store.get("profile") || new UserProfile();
        
        this.profileService = new ProfileService();
        this.yearsService = new YearsService();
        this.notify = new Notify();
        this.timezones = this.prepareItemList(<Array<string>>(Timezones));
    }
    
    public mounted(): Promise<void> {
        return this.OnLoad();
    }

    public OnLoad(): Promise<void> {
        let availableBirthYears = this.yearsService.getBirthYears();
        this.birthYears = this.prepareItemList(availableBirthYears);

        let availableGenders = <Array<string>>["Male", "Female", "Non-binary"];
        this.genders = this.prepareItemList(availableGenders);

        let availableTechYears = this.yearsService.getTechYears();
        this.startedInTechYears = this.prepareItemList(availableTechYears);

        this.statuses = <Array<Item<number>>>[
            <Item<number>> {name: "Hidden", value: ProfileStatus.Hidden}, 
            <Item<number>> {name: "Unavailable", value: ProfileStatus.Unavailable}, 
            <Item<number>> {name: "Available", value: ProfileStatus.Available}
        ];
        
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

    public configure(profileService: IProfileService, yearsService: IYearsService, notify: INotify, timezones: Array<string>) {
        this.profileService = profileService;
        this.yearsService = yearsService;
        this.notify = notify;
        this.timezones = this.prepareItemList(timezones);
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

    private prepareItemList<T>(values: Array<T>): Array<Item<T>> {
        let items = new Array<Item<T>>();

        items.push(<Item<T>>{name: "Unspecified"});

        for (let index = 0; index < values.length; index++) {
            let value = values[index];

            items.push(<Item<T>>{name: value.toString(), value: value});
        }

        return items;
    }
}