import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { AccountProfile, ProfileStatus } from "../../services/api/accountProfileService";

@Component
export default class AccountProfileAlerts extends Vue {

    @Prop()
    public model: AccountProfile;
    
    public IsBanned(): boolean {
        if (this.model.bannedAt) {
            return true;
        }
        
        return false;
    }

    public IsHidden(): boolean {
        if (this.model.status === ProfileStatus.Hidden) {
            return true;
        }
        
        return false;
    }

    public IsSearchable(): boolean {
        if (this.model.status === ProfileStatus.Hidden) {
            return false;
        }
        
        if (this.model.gender) {
            return true;
        }
        
        if (this.model.languages && this.model.languages.length > 0) {
            return true;
        }
        
        if (this.model.skills && this.model.skills.length > 0) {
            return true;
        }
        
        return false;
    }
}