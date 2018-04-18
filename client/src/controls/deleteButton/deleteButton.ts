import { Component, Prop } from "vue-property-decorator";
import SignInComponent from "../../components/signInComponent/signInComponent";
import { IAccountProfileService, AccountProfileService } from "../../services/api/accountProfileService";

@Component
export default class DeleteButton extends SignInComponent {
    private profileService: IAccountProfileService;

    public showConfirm: boolean;

    public constructor() {
        super();

        this.showConfirm = false;
        this.disabled = false;
        this.profileService = new AccountProfileService();
    }

    @Prop()
    public disabled: boolean;
    
    public configure(profileService: IAccountProfileService) {
        this.profileService = profileService;
    }

    public OnShowConfirm(): void {
        this.showConfirm = true;
    }

    public async OnDelete(): Promise<void> {
        await this.profileService.deleteAccountProfile();
    }
}