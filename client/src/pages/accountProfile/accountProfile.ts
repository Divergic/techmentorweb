import Component from "vue-class-component";
import AuthComponent from "../../components/authComponent/authComponent";
import ProfilePhoto from "../../controls/profilePhoto/profilePhoto.vue";
import SkillList from "../../controls/skillList/skillList.vue";
import PrivacyBar from "../../controls/privacyBar/privacyBar.vue";
import AccountProfileAlerts from "../../controls/accountProfileAlerts/accountProfileAlerts.vue";
import { IAccountProfileService, AccountProfileService, AccountProfile, ProfileStatus } from "../../services/api/accountProfileService";
import Failure from "../../services/failure";
import { INotify, Notify } from "../../services/notify";
import { IListsService, ListsService, ListItem } from "../../services/listsService";
import { ICategoriesService, CategoriesService, Category, CategoryGroup } from "../../services/api/categoriesService";
import { ILocation, Location } from "../../services/location";
import { IJsonDownloader, JsonDownloader } from "./jsonDownloader";
import store from "store";
import marked from "marked";

@Component({
    components: {
      ProfilePhoto,
      SkillList,
      AccountProfileAlerts,
      PrivacyBar
    }
  })
export default class Profile extends AuthComponent {
    private profileService: IAccountProfileService;
    private listsService: IListsService;
    private categoriesService: ICategoriesService;
    private locationService: ILocation;
    private jsonDownloader: IJsonDownloader;
    private notify: INotify;

    // Properties for view binding
    public loading: boolean = true;
    public compiledMarkdown: string = "";
    public model: AccountProfile = new AccountProfile();
    private storedModel: AccountProfile = new AccountProfile();
    public timezones: Array<string> = new Array<string>();
    public techYears: Array<number> = new Array<number>();
    public birthYears: Array<number> = new Array<number>();
    public statuses: Array<ListItem<string>> = new Array<ListItem<string>>();
    public genders: Array<string> = new Array<string>();
    public languages: Array<string> = new Array<string>();
    public disableButtons: boolean = false;
    public savingModel: boolean = false;
    public hidingModel: boolean = false;
    public exportingModel: boolean = false;
    public deletingModel: boolean = false;
    public expandPrivacy: boolean = false;

    public constructor() {
        super();
        
        this.profileService = new AccountProfileService();
        this.listsService = new ListsService();
        this.categoriesService = new CategoriesService();
        this.locationService = new Location();
        this.jsonDownloader = new JsonDownloader();
        this.notify = new Notify();
    }
    
    public configure(profileService: IAccountProfileService, listsService: IListsService, categoriesService: ICategoriesService, locationService: ILocation, jsonDownloader: IJsonDownloader, notify: INotify) {
        this.profileService = profileService;
        this.listsService = listsService;
        this.categoriesService = categoriesService;
        this.locationService = locationService;
        this.jsonDownloader = jsonDownloader;
        this.notify = notify;

        this.init(locationService);
    }

    public mounted(): Promise<void> {
        return this.OnLoad();
    }

    public async OnLoad(): Promise<void> {
        let locationHash = this.locationService.getHash() || "";

        this.expandPrivacy = (locationHash.toLowerCase() === "#privacy");
        
        let listsTask = this.loadLists();
        let profileTask = this.loadProfile();

        await Promise.all([listsTask, profileTask]);

        this.loading = false;
    }

    public async OnSave(): Promise<void> {
        let isValid = await this.$validator.validateAll("profileForm");

        if (!isValid) {
            this.notify.showWarning("Oh no, there are some errors on the form. Please fix these and try again.");
            
            return;
        }

        // Temporarily store the model to handle scenarios where the auth token has expired
        // We don't want the user to loose their changes with an auth refresh
        store.set("profile", this.model);
        store.set("storedProfile", this.storedModel);

        try {
            this.disableButtons = true;
            this.savingModel = true;

            await this.profileService.updateAccountProfile(this.model);
            
            // Store the last model sent to the service
            this.storedModel = new AccountProfile(this.model);

            store.remove("profile");
            store.remove("storedProfile");
            
            this.notify.showSuccess("Your profile has been updated.");        
        }
        catch (failure) {
            // Check Failure.visibleToUser
            if (failure.visibleToUser) {
                this.notify.showFailure(<Failure>failure);
            } else {
                this.notify.showError("Uh oh. Someting went wrong. We will look into it.");
                
                throw failure;
            }
        }
        finally {
            this.savingModel = false;
            this.disableButtons = false;
        }
    }

    public async OnHide(): Promise<void> {
        this.model.status = ProfileStatus.Hidden;
        this.storedModel.status = ProfileStatus.Hidden;

        // Temporarily store the model to handle scenarios where the auth token has expired
        // We don't want the user to loose their changes with an auth refresh
        store.set("profile", this.model);
        store.set("storedProfile", this.storedModel);

        try {
            this.disableButtons = true;
            this.hidingModel = true;

            await this.profileService.updateAccountProfile(this.storedModel);
            
            store.remove("profile");
            store.remove("storedProfile");
            
            this.notify.showSuccess("Your profile has been hidden.");        
        }
        catch (failure) {
            // Check Failure.visibleToUser
            if (failure.visibleToUser) {
                this.notify.showFailure(<Failure>failure);
            } else {
                this.notify.showError("Uh oh. Someting went wrong. We will look into it.");
                
                throw failure;
            }
        }
        finally {
            this.hidingModel = false;
            this.disableButtons = false;
        }
    }

    public async OnExport(): Promise<void> {
        try {
            this.disableButtons = true;
            this.exportingModel = true;

            let exportProfile = await this.profileService.exportAccountProfile();
            let name = exportProfile.id + ".json";

            this.jsonDownloader.download(name, exportProfile);
        }
        catch (failure) {
            // Check Failure.visibleToUser
            if (failure.visibleToUser) {
                this.notify.showFailure(<Failure>failure);
            } else {
                this.notify.showError("Uh oh. Someting went wrong. We will look into it.");
                
                throw failure;
            }
        }
        finally {
            this.exportingModel = false;
            this.disableButtons = false;
        }
    }

    public async OnDelete(): Promise<void> {
        try {
            this.disableButtons = true;
            this.deletingModel = true;

            await this.profileService.deleteAccountProfile();
            
            this.signOut();
        }
        catch (failure) {
            this.disableButtons = false;
            this.deletingModel = false;
            
            // Check Failure.visibleToUser
            if (failure.visibleToUser) {
                this.notify.showFailure(<Failure>failure);
            } else {
                this.notify.showError("Uh oh. Someting went wrong. We will look into it.");
                
                throw failure;
            }
        }
    }

    public ShowWebsite(uri: string): void {
        window.open(uri, "_blank");
    }

    public OnViewCoCClick(event: Event): void {
        event.stopPropagation();
        event.preventDefault();

        let element: HTMLAnchorElement = <HTMLAnchorElement>event.srcElement;

        window.open(element.href, element.target);
    }

    public CheckLanguages(languages: Array<string>): void {
        this.model.languages = languages.map((language) => {
            return this.toTitleCase(language);
        });
    }

    public CompileMarkdown(): void {
        if (!this.model.about) {
            this.compiledMarkdown = "";
        }
        else {
            let options = {
                sanitized: true
            };
    
            this.compiledMarkdown = marked(this.model.about, options);
        }
    }
    
    private toTitleCase(value: string): string {
        return value.toLowerCase().split(" ").map((word) => {
            return word.replace(word[0], word[0].toUpperCase());
        }).join(" ");
    }

    private async loadLists(): Promise<void> {
        this.timezones = this.listsService.getTimezones();
        this.birthYears = this.listsService.getBirthYears();
        this.techYears = this.listsService.getTechYears();
        this.statuses = this.listsService.getProfileStatuses();

        let categories = await this.categoriesService.getCategories();

        this.languages = categories
            .filter((item: Category) => {
                return item.group === CategoryGroup.Language;
            }).map((item: Category) => {
                return item.name;
            });

        this.genders = categories
            .filter((item: Category) => {
                return item.group === CategoryGroup.Gender;
            }).map((item: Category) => {
                return item.name;
            });
    }
 
    private async loadProfile(): Promise<void> {
        try {
            // Get the profile stored before an auth refresh or create a new one
            let profile: AccountProfile = <AccountProfile>store.get("profile");
            let storedProfile: AccountProfile = <AccountProfile>store.get("storedProfile");

            if (profile) {
                this.notify.showInformation("Your authentication session had expired.<br />Please try saving your profile again.");
    
                store.remove("profile");
                store.remove("storedProfile");
            }
            else {
                profile = await this.profileService.getAccountProfile();
                storedProfile = profile;
            }

            // Use a copy constructor to ensure that the type has all fields initialised
            this.model = new AccountProfile(profile);
            
            // Store the last model obtained from the service
            this.storedModel = new AccountProfile(storedProfile);

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

            this.CompileMarkdown();
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