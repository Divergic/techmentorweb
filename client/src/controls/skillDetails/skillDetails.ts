import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import { Skill } from "../../services/api/skill";

@Component
export default class SkillDetails extends Vue {
    
    @Prop()
    skill: Skill;
    
    public get DisplayName(): string {
        if (!this.skill) {
            return "";
        }

        if (!this.skill.name) {
            return "";
        }

        return this.skill.name;
    }

    public get DisplayLevel(): string {
        if (!this.skill) {
            return "";
        }

        if (!this.skill.level) {
            return "";
        }
 
        let first = this.skill.level[0].toLocaleUpperCase();
        let remainder = this.skill.level.substr(1).toLocaleLowerCase();

        return first + remainder;
    }

    public get DisplayYearRange(): string {
        if (!this.skill) {
            return "";
        }

        if (!this.skill.yearStarted) {
            if (this.skill.yearLastUsed) {
                return "up to " + this.skill.yearLastUsed;
            }

            // Both year values are not supplied
            return "";
        }

        let endYear = new Date().getFullYear();

        if (this.skill.yearLastUsed) {
            endYear = <number>this.skill.yearLastUsed;
        }

        let totalYears = endYear - this.skill.yearStarted;

        if (totalYears < 1) {
            // Other than a bug where the start is after the end, this is likely to be that the years are the same
            // It doesn't make sense to say the user has no experience, so we will use a year as a minimum
            totalYears = 1;
        }

        let yearLabel = "years";

        if (totalYears === 1) {
            yearLabel = "year";
        }

        // We have a year started
        if (this.skill.yearLastUsed) {
            // We have a value for both years
            return "over " + totalYears + " " + yearLabel + " until " + this.skill.yearLastUsed;
        }

        return "over " + totalYears + " " + yearLabel;
    }
}