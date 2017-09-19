import { IHttp, Http } from "../http";

export class SkillLevel {
    public static Hobbyist = "hobbyist";
    public static Beginner = "beginner";
    public static Intermediate = "intermediate";
    public static Expert = "expert";
    public static Master = "master";
};

export class Skill {
        level: string;
        name: string;
        yearLastUsed?: number;
        yearStarted?: number;
};

export class ProfileStatus
{
    public static Hidden: string = "hidden";
    public static Unavailable: string = "unavailable";
    public static Available: string = "available";
};

export class UserProfile {
    public bannedAt?: Date;
    public id: string;
    public about?: string;
    public birthYear?: number;
    public email: string;
    public firstName: string;
    public gender?: string;
    public gitHubUsername?: string;
    public languages?: Array<string>;
    public lastName: string;
    public timeZone?: string;
    public skills?: Array<Skill>;
    public status: string;
    public twitterUsername?: string;
    public website?: string;
    public yearStartedInTech?: number;

    public constructor() {
        this.status = ProfileStatus.Hidden;
    }    
};

export interface IProfileService {
    getAccountProfile(): Promise<UserProfile>;
    updateAccountProfile(profile: UserProfile): Promise<void>;
}

export class ProfileService implements IProfileService {
    public constructor(private http: IHttp = new Http()) {
    }

    public getAccountProfile(): Promise<UserProfile> {
        let uri: string = "profile/";

        return this.http.get<UserProfile>(uri);
    }

    public updateAccountProfile(profile: UserProfile): Promise<void> {
        let uri: string = "profile/";

        return this.http.put<UserProfile, void>(uri, profile);
    }
};