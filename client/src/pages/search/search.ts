import Component from "vue-class-component";
import Vue from "vue";
import Failure from "../../services/failure";
import { INotify, Notify } from "../../services/notify";
import { IProfileService, ProfileService , CategoryFilter } from "../../services/api/profileService";
import SearchFilters from "../../controls/searchFilters/searchFilters.vue";
import ProfileResult from "../../services/api/profileResult";
import ProfilePreview from "../../controls/profilePreview/profilePreview.vue";

@Component({
    components: {
        SearchFilters,
        ProfilePreview
    }
  })
export default class Search extends Vue {
    private profileService: IProfileService;
    private notify: INotify;
    
    // Properties for view binding
    public searching: boolean = false;
    public searchRun: boolean = false;
    public profiles: Array<ProfileResult> = new Array<ProfileResult>();

    public constructor() {
        super();
        
        this.profileService = new ProfileService();
        this.notify = new Notify();
    }
    
    public configure(profileService: IProfileService, notify: INotify) {
        this.profileService = profileService;
        this.notify = notify;
    }

    public async OnRunSearch(gender: string, languages: Array<string>, skills: Array<string>): Promise<void> {
        this.searching = true;
        this.profiles = new Array<ProfileResult>();

        try {
            let filters = new Array<CategoryFilter>();
    
            // Build up the search filters
            skills.forEach(element => {
                let filter = <CategoryFilter>{
                    group: "skill",
                    name: element
                };
    
                filters.push(filter);
            });
            languages.forEach(element => {
                let filter = <CategoryFilter>{
                    group: "language",
                    name: element
                };
    
                filters.push(filter);
            });

            if (gender) {
                let filter = <CategoryFilter>{
                    group: "gender",
                    name: gender
                };
    
                filters.push(filter);
            }
    
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
}