
export class SkillLevel {
    public static Hobbyist = "hobbyist";
    public static Beginner = "beginner";
    public static Intermediate = "intermediate";
    public static Expert = "expert";
    public static Master = "master";
}

export class Skill {
    level: string;
    name: string;
    yearLastUsed: number | null;
    yearStarted: number | null;

    public constructor(skill?: Skill) {
        if (skill) {
            // This is a copy constructor
            this.level = skill.level;
            this.name = skill.name;
            this.yearLastUsed = skill.yearLastUsed;
            this.yearStarted = skill.yearStarted;
        } else {
            // Add default values so that properties exist for binding in the UI
            this.level = <string><any>null;
            this.name = <string><any>null;
            this.yearLastUsed = null;
            this.yearStarted = null;
        }
    }
}
