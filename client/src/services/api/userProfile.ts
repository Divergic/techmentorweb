import { Skill } from "./skill";
import ProfileResult from "./profileResult";

export default class UserProfile extends ProfileResult {
    public constructor(source: UserProfile | null = null) {
        super(source);

        if (source) {
            this.about = source.about;
            this.gitHubUsername = source.gitHubUsername;
            this.languages = source.languages || new Array<string>();
            this.skills = source.skills || new Array<Skill>();
            this.twitterUsername = source.twitterUsername;
            this.website = source.website;
        }
        else {
            this.about = null;
            this.gitHubUsername = null;
            this.languages = new Array<string>();
            this.skills = new Array<Skill>();
            this.twitterUsername = null;
            this.website = null;
        }
    }

    public about: string | null;
    public gitHubUsername: string | null;
    public languages: Array<string>;
    public skills: Array<Skill>;
    public twitterUsername: string | null;
    public website: string | null;
};
