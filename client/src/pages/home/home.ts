import Component from "vue-class-component";
import Vue from "vue";
import Failure from "../../services/failure";
import { INotify, Notify } from "../../services/notify";
import { ICategoriesService, CategoriesService, Category, CategoryGroup } from "../../services/api/categoriesService";
import { IProfileService, ProfileService, CategoryFilter } from "../../services/api/profileService";
import ProfileResult from "../../services/api/profileResult";
import ProfilePreview from "../../controls/profilePreview/profilePreview.vue";

@Component({
    components: {
        ProfilePreview
    }
  })
export default class Home extends Vue {
    private categoriesService: ICategoriesService;
    private profileService: IProfileService;
    private notify: INotify;
    
    // Properties for view binding
    public loadingLists: boolean = true;
    public genders: Array<Category> = new Array<Category>();
    public languages: Array<Category> = new Array<Category>();
    public skills: Array<Category> = new Array<Category>();
    public selectedGenders: Array<string> = new Array<string>();
    public selectedLanguages: Array<string> = new Array<string>();
    public selectedSkills: Array<string> = new Array<string>();
    public searching: boolean = false;
    public searchRun: boolean = false;
    public profiles: Array<ProfileResult> = new Array<ProfileResult>();

    public constructor() {
        super();
        
        this.categoriesService = new CategoriesService();
        this.profileService = new ProfileService();
        this.notify = new Notify();
    }
    
    public configure(categoriesService: ICategoriesService, profileService: IProfileService, notify: INotify) {
        this.categoriesService = categoriesService;
        this.profileService = profileService;
        this.notify = notify;
    }

    public mounted(): Promise<void> {
        return this.OnLoad();
    }

    public async OnLoad(): Promise<void> {
        let categories = await this.loadCategories();

        this.genders = categories
            .filter((item: Category) => {
                return item.group === CategoryGroup.Gender;
            });
        
        this.languages = categories
            .filter((item: Category) => {
                return item.group === CategoryGroup.Language;
            });

        this.skills = categories
            .filter((item: Category) => {
                return item.group === CategoryGroup.Skill;
            });
            
        this.loadingLists = false;
    }

    public async OnSearch(): Promise<void> {
        this.searching = true;
        this.profiles = new Array<ProfileResult>();

        try {
            let filters = new Array<CategoryFilter>();
    
            // Build up the search filters
            this.selectedSkills.forEach(element => {
                let filter = <CategoryFilter>{
                    group: "skill",
                    name: element
                };
    
                filters.push(filter);
            });
            this.selectedLanguages.forEach(element => {
                let filter = <CategoryFilter>{
                    group: "language",
                    name: element
                };
    
                filters.push(filter);
            });
            this.selectedGenders.forEach(element => {
                let filter = <CategoryFilter>{
                    group: "gender",
                    name: element
                };
    
                filters.push(filter);
            });
    
            this.profiles = await this.profileService.searchProfiles(filters);
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
            this.searching = false;
            this.searchRun = true;
        }
    }

    public get FiltersSelected(): boolean {
        if (this.selectedSkills.length > 0) {
            return true;
        }
        
        if (this.selectedLanguages.length > 0) {
            return true;
        }

        if (this.selectedGenders.length > 0) {
            return true;
        }

        return false;
    }

    private async loadCategories(): Promise<Array<Category>> {
        let categories = await this.categoriesService.getCategories();

        // Filter out categories without links
        let availableCategories = categories.filter((item: Category) => {
            return item.linkCount > 0;
        });

        return availableCategories;
    }
}