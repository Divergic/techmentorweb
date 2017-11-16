import { IHttp, Http } from "../http";
import { Skill } from "./skill";

export class ProfileStatus {
    public static Hidden: string = "hidden";
    public static Unavailable: string = "unavailable";
    public static Available: string = "available";
}

export class AccountProfile {
    public bannedAt: Date | null;
    public id: string;
    public about: string | null;
    public birthYear: number | null;
    public email: string;
    public firstName: string;
    public gender: string | null;
    public gitHubUsername: string | null;
    public languages: Array<string>;
    public lastName: string;
    public timeZone: string | null;
    public photoId: string | null;
    public photoHash: string | null;
    public skills: Array<Skill>;
    public status: string;
    public twitterUsername: string | null;
    public website: string | null;
    public yearStartedInTech: number | null;

    public constructor(profile: AccountProfile | null = null) {
        if (profile) {
            // This is a copy constructor
            this.bannedAt = profile.bannedAt;
            this.id = profile.id;
            this.about = profile.about;
            this.birthYear = profile.birthYear;
            this.email = profile.email;
            this.firstName = profile.firstName;
            this.gender = profile.gender;
            this.gitHubUsername = profile.gitHubUsername;
            this.languages = profile.languages || new Array<string>();
            this.lastName = profile.lastName;
            this.photoHash = profile.photoHash;
            this.photoId = profile.photoId;
            this.timeZone = profile.timeZone;

            this.skills = new Array<Skill>();

            if (profile.skills) {
                let sourceSkills = <Array<Skill>>profile.skills;
                
                sourceSkills.forEach(element => {
                    let skill = new Skill(element);
                    
                    this.skills.push(skill);
                });
            }

            this.status = profile.status;
            this.twitterUsername = profile.twitterUsername;
            this.website = profile.website;
            this.yearStartedInTech = profile.yearStartedInTech;
        }
        else {
            this.status = ProfileStatus.Hidden;
            this.languages = new Array<string>();
            this.skills = new Array<Skill>();
        }
    }
}

export interface IAccountProfileService {
    getAccountProfile(): Promise<AccountProfile>;
    updateAccountProfile(profile: AccountProfile): Promise<void>;
}

export class AccountProfileService implements IAccountProfileService {
    public constructor(private http: IHttp = new Http()) {
    }

    public getAccountProfile(): Promise<AccountProfile> {
        let uri: string = "profile/";

        return this.http.get<AccountProfile>(uri);
    }

    public updateAccountProfile(profile: AccountProfile): Promise<void> {
        let uri: string = "profile/";

        return this.http.put<AccountProfile, void>(uri, profile);
    }
}