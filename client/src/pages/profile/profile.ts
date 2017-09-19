import Component from "vue-class-component";
import AuthComponent from "../../components/authComponent";
import { IProfileService, ProfileService, UserProfile, ProfileStatus, Skill } from "../../services/api/profileService";
import Failure from "../../services/failure";
import { INotify, Notify } from "../../services/notify";
import { IListsService, ListsService, ListItem } from "../../services/lists";
import { ICategoriesService, CategoriesService, Category, CategoryGroup } from "../../services/api/categoriesService";
import store from "store";
import marked from "marked";

@Component
export default class Profile extends AuthComponent {
    private profileService: IProfileService;
    private listsService: IListsService;
    private categoriesService: ICategoriesService
    private notify: INotify;

    // Properties for view binding
    private loading: boolean = true;
    private compiledMarkdown: string = "";
    private model: UserProfile = new UserProfile();
    private timezones: Array<ListItem<string>> = new Array<ListItem<string>>();
    private birthYears: Array<ListItem<number>> = new Array<ListItem<number>>();
    private genders: Array<ListItem<string>> = new Array<ListItem<string>>();
    private statuses: Array<ListItem<string>> = new Array<ListItem<string>>();
    private techYears: Array<ListItem<number>> = new Array<ListItem<number>>();
    private skillLevels: Array<ListItem<string>> = new Array<ListItem<string>>();
    private languages: Array<string> = new Array<string>();
    private skills: Array<string> = new Array<string>();
    private skillModel: Skill = new Skill();
    private showDialog: boolean = false;

    public constructor() {
        super();
        
        this.profileService = new ProfileService();
        this.listsService = new ListsService();
        this.categoriesService = new CategoriesService();
        this.notify = new Notify();
    }
    
    public configure(profileService: IProfileService, listsService: IListsService, categoriesService: ICategoriesService, notify: INotify) {
        this.profileService = profileService;
        this.listsService = listsService;
        this.categoriesService = categoriesService;
        this.notify = notify;
    }

    public mounted(): Promise<void> {
        return this.OnLoad();
    }

    public async OnLoad(): Promise<void> {
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
                this.notify.showError("Uh oh. Someting went wrong. We will look into it.");
                
                throw failure;
            }
        }
    }

    public OnAddSkill(): void {
        this.skillModel = new Skill();

        // Add default values when missing to fields that should be bound to lists that provide an unspecified value
        // The reason for this is that the model from the API will have these fields missing from the JSON
        // but we want the select lists to default to the Unspecified value. We need to trigger this binding
        // by pushing a value onto the properties that match the Unspecified value in the select.
        this.skillModel.level = <string><any>null;
        this.skillModel.yearLastUsed = <number><any>null;
        this.skillModel.yearStarted = <number><any>null;
        
        // Ensure any previous validation triggers have been removed
        this.$validator.reset();

        this.showDialog = true;
    }

    public async OnSaveSkill(): Promise<void> {        
        let isValid = await this.$validator.validateAll("skillForm");

        if (!isValid) {
            this.notify.showWarning("Oh no, there are some errors on the form. Please fix these and try again.");
            
            return;
        }
        
        this.model.skills = this.model.skills || new Array<Skill>();
        this.model.skills.push(this.skillModel);

        this.showDialog = false;
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

    public isHidden(): boolean {
        if (this.loading) {
            return false;
        }

        if (this.model.status == ProfileStatus.Hidden) {
            return true;
        }
        
        return false;
    }

    public ShowWebsite(uri: string): void {
        window.open(uri, '_blank');
    }

    public CheckLanguages(languages: Array<string>): void {
        this.model.languages = languages.map((language) => {
            return this.toTitleCase(language)
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
        return value.toLowerCase().split(' ').map((word) => {
            return word.replace(word[0], word[0].toUpperCase());
        }).join(' ');
    }

    private async loadLists(): Promise<void> {
        this.timezones = this.listsService.getTimezones();
        this.birthYears = this.listsService.getBirthYears();
        this.techYears = this.listsService.getTechYears();
        this.statuses = this.listsService.getProfileStatuses();
        this.genders = this.listsService.getGenders();
        this.skillLevels = this.listsService.getSkillLevels();

        let categories = await this.categoriesService.getCategories();

        this.languages = categories
            .filter((item: Category) => {
                return item.group === CategoryGroup.Language;
            }).map((item: Category) => {
                return item.name
            });

        this.skills = categories
            .filter((item: Category) => {
                return item.group === CategoryGroup.Skill;
            }).map((item: Category) => {
                return item.name
            });
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