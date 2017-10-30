import { IHttp, Http } from "../http";
import ProfileResult from "./profileResult";
import UserProfile from "./userProfile";

export class CategoryFilter {
    group: string;
    name: string;
}

export interface IProfileService {
    getProfile(id: string): Promise<UserProfile>;
    searchProfiles(filters: Array<CategoryFilter>): Promise<Array<ProfileResult>>;
}

export class ProfileService implements IProfileService {
    public constructor(private http: IHttp = new Http()) {
    }

    public async getProfile(id: string): Promise<UserProfile> {
        let uri: string = "profiles/" + encodeURIComponent(id);
        
        let profile = await this.http.get<UserProfile>(uri);

        // Use a copy constructor to ensure that the type has all fields initialised with access to class defined members
        return new UserProfile(profile);
    }

    public async searchProfiles(filters: Array<CategoryFilter>): Promise<Array<ProfileResult>> {
        let uri: string = "profiles/?";

        filters.forEach(element => {
            uri += encodeURIComponent(element.group) + "=" + encodeURIComponent(element.name) + "&";
        });

        // Remove the trailing &
        uri = uri.substr(0, uri.length - 1);

        let profiles = await this.http.get<Array<ProfileResult>>(uri);

        profiles = profiles || new Array<ProfileResult>();

        return profiles.map((profile) => {
            // Use a copy constructor to ensure that the type has all fields initialised with access to class defined members
            return new ProfileResult(profile);
        });
    }
}