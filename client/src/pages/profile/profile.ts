import Vue from "vue";
import Component from "vue-class-component";
import SkillDetails from "../../controls/skillDetails/skillDetails.vue";
import { IProfileService, ProfileService } from "../../services/api/profileService";
import UserProfile from "../../services/api/userProfile";
import Failure from "../../services/failure";
import { INotify, Notify } from "../../services/notify";
import marked from "marked";

@Component({
    components: {
      SkillDetails
    }
  })
export default class Profile extends Vue {
    private profileService: IProfileService;
    private notify: INotify;

    // Properties for view binding
    private loading: boolean = true;
    private compiledMarkdown: string = "";
    private model: UserProfile = new UserProfile();

    public constructor() {
        super();
        
        this.profileService = new ProfileService();
        this.notify = new Notify();
    }
    
    public configure(profileService: IProfileService, notify: INotify) {
        this.profileService = profileService;
        this.notify = notify;
    }

    public mounted(): Promise<void> {
        return this.OnLoad();
    }

    public async OnLoad(): Promise<void> {
        this.model = await this.loadProfile(this.$route.params.id);

        this.CompileMarkdown();
        
        this.loading = false;
    }

    public ShowWebsite(uri: string): void {
        window.open(uri, '_blank');
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

    public HasTechnicalData(): boolean {
        if (!this.model) {
            return false;
        }

        if (this.model.yearStartedInTech) {
            return true;
        }

        if (this.model.website) {
            return true;
        }

        if (this.model.gitHubUsername) {
            return true;
        }

        if (this.model.twitterUsername) {
            return true;
        }

        if (this.model.skills && this.model.skills.length > 0) {
            return true;
        }

        return false;
    }
    
    private async loadProfile(id: string): Promise<UserProfile> {
        try {
            return await this.profileService.getProfile(id);
        }
        catch (failure) {
            // Check Failure.visibleToUser
            if (failure.visibleToUser) {
                this.notify.showFailure(<Failure>failure);
            } else if(failure.message && failure.message.indexOf("Not Found") > -1) {                
                this.$router.push({ name: "notfound"});
            } else {
                throw failure;
            }
        }

        return new UserProfile();
    }
}