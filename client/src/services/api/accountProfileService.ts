import { IHttp, Http } from "../http";
import { Skill } from "./skill";

export class ProfileStatus {
    public static Hidden: string = "hidden";
    public static Unavailable: string = "unavailable";
    public static Available: string = "available";
}

export class AccountProfile {
    public about: string | null;
    public acceptCoC: boolean;
    public bannedAt: Date | null;
    public birthYear: number | null;
    public email: string;
    public firstName: string;
    public gender: string | null;
    public gitHubUsername: string | null;
    public id: string;
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
            this.about = profile.about;
            this.acceptCoC = profile.acceptCoC;
            this.bannedAt = profile.bannedAt;
            this.birthYear = profile.birthYear;
            this.email = profile.email;
            this.firstName = profile.firstName;
            this.gender = profile.gender;
            this.gitHubUsername = profile.gitHubUsername;
            this.id = profile.id;
            this.languages = profile.languages || new Array<string>();
            this.lastName = profile.lastName;
            this.photoHash = profile.photoHash;
            this.photoId = profile.photoId;

            this.skills = new Array<Skill>();

            if (profile.skills) {
                let sourceSkills = <Array<Skill>>profile.skills;
                
                sourceSkills.forEach(element => {
                    let skill = new Skill(element);
                    
                    this.skills.push(skill);
                });
            }

            this.status = profile.status;
            this.timeZone = profile.timeZone;
            this.twitterUsername = profile.twitterUsername;
            this.website = profile.website;
            this.yearStartedInTech = profile.yearStartedInTech;
        }
        else {
            this.about = null;
            this.acceptCoC = false;
            this.bannedAt = null;
            this.birthYear = null;
            this.email = <string><any>null;
            this.firstName = <string><any>null;
            this.gender = null;
            this.gitHubUsername = null;
            this.id = <string><any>null;
            this.languages = new Array<string>();
            this.lastName = <string><any>null;
            this.photoHash = null;
            this.photoId = null;
            this.skills = new Array<Skill>();
            this.status = ProfileStatus.Hidden;
            this.timeZone = null;
            this.twitterUsername = null;
            this.website = null;
            this.yearStartedInTech = null;
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