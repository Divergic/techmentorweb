import Component from "vue-class-component";
import AuthComponent from "../../components/authComponent";
// import { IProfileService, ProfileService } from "../../services/api/profileService";
import Failure from "../../services/failure";
import { INotify, Notify } from "../../services/notify";

@Component
export default class Profile extends AuthComponent {

    public moreSettings: Boolean = false;
    // private service: IProfileService;
    private notify: INotify;

    public constructor() {
        super();
        
        // this.service = new ProfileService();
        this.notify = new Notify();
    }
    
    public mounted(): Promise<void> {
        return this.OnLoad();
    }

    public async OnLoad(): Promise<void> {
    }

    public configure(
        // service: IProfileService, 
        notify: INotify) {
        // this.service = service;
        this.notify = notify;
    }

    async register(): Promise<void> {
        try {
            // await this.service.register(this.model);
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