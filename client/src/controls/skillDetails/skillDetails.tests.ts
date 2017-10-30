import SkillDetails from "./skillDetails";
import { Skill } from "../../services/api/skill";

describe("SkillDetails", () => {
    let sut: SkillDetails;
    let model: Skill;

    beforeEach(() => {
        sut = new SkillDetails();
        model = <Skill>{
            name: "C#",
            level: "expert",
            yearLastUsed: 2011,
            yearStarted: 2006
        };

        sut.skill = model;
    });

    describe("DisplayName", () => {
        it("returns empty when model is null", () => {
            sut.skill = <Skill><any>null;

            let actual = sut.DisplayName;

            expect(actual).toEqual("");
        });
        it("returns empty when model is undefined", () => {
            sut.skill = <Skill><any>undefined;

            let actual = sut.DisplayName;

            expect(actual).toEqual("");
        });
        it("returns empty when name is null", () => {
            sut.skill.name = <string><any>null;

            let actual = sut.DisplayName;

            expect(actual).toEqual("");
        });
        it("returns empty when name is undefined", () => {
            sut.skill.name = <string><any>undefined;

            let actual = sut.DisplayName;

            expect(actual).toEqual("");
        });
        it("returns model name", () => {
            let actual = sut.DisplayName;

            expect(actual).toEqual(model.name);
        });
    });

    describe("DisplayLevel", () => {
        it("returns empty when model is null", () => {
            sut.skill = <Skill><any>null;

            let actual = sut.DisplayLevel;

            expect(actual).toEqual("");
        });
        it("returns empty when model is undefined", () => {
            sut.skill = <Skill><any>undefined;

            let actual = sut.DisplayLevel;

            expect(actual).toEqual("");
        });
        it("returns empty when level is null", () => {
            sut.skill.level = <string><any>null;

            let actual = sut.DisplayLevel;

            expect(actual).toEqual("");
        });
        it("returns empty when level is undefined", () => {
            sut.skill.level = <string><any>undefined;

            let actual = sut.DisplayLevel;

            expect(actual).toEqual("");
        });
        it("returns propercase value", () => {
            let actual = sut.DisplayLevel;

            expect(actual).toEqual("Expert");
        });
        it("returns propercase value when level already propercase", () => {
            sut.skill.level = "Expert";

            let actual = sut.DisplayLevel;

            expect(actual).toEqual("Expert");
        });
    });

    describe("DisplayYearRange", () => {
        it("returns empty when model is null", () => {
            sut.skill = <Skill><any>null;

            let actual = sut.DisplayYearRange;

            expect(actual).toEqual("");
        });
        it("returns empty when model is null", () => {
            sut.skill = <Skill><any>undefined;

            let actual = sut.DisplayYearRange;

            expect(actual).toEqual("");
        });
        it("returns empty when yearStarted and yearLastUsed are null", () => {
            sut.skill.yearStarted = null;
            sut.skill.yearLastUsed = null;

            let actual = sut.DisplayYearRange;

            expect(actual).toEqual("");
        });
        it("returns empty when yearStarted and yearLastUsed are undefined", () => {
            sut.skill.yearStarted = <number><any>undefined;
            sut.skill.yearLastUsed = <number><any>undefined;

            let actual = sut.DisplayYearRange;

            expect(actual).toEqual("");
        });
        it("returns range message when yearStarted and yearLastUsed have values", () => {
            let years = (<number>sut.skill.yearLastUsed - <number>sut.skill.yearStarted);
            let actual = sut.DisplayYearRange;

            expect(actual).toEqual("over " + years + " years until " + sut.skill.yearLastUsed);
        });
        it("returns range message of one year when yearStarted is one year less than yearLastUsed", () => {
            sut.skill.yearLastUsed = <number>sut.skill.yearStarted + 1;
            let actual = sut.DisplayYearRange;

            expect(actual).toEqual("over 1 year until " + sut.skill.yearLastUsed);
        });
        it("returns range message of one year when yearStarted and yearLastUsed are same", () => {
            sut.skill.yearLastUsed = sut.skill.yearStarted;
            let actual = sut.DisplayYearRange;

            expect(actual).toEqual("over 1 year until " + sut.skill.yearLastUsed);
        });
        it("returns over years message when only yearStarted has a value", () => {
            let years = (new Date().getFullYear() - <number>sut.skill.yearStarted);
            sut.skill.yearLastUsed = null;

            let actual = sut.DisplayYearRange;

            expect(actual).toEqual("over " + years + " years");
        });
        it("returns over 1 year message when yearStarted is one less than current year", () => {
            let currentYear = new Date().getFullYear();
            sut.skill.yearStarted = currentYear - 1;
            sut.skill.yearLastUsed = null;

            let actual = sut.DisplayYearRange;

            expect(actual).toEqual("over 1 year");
        });
        it("returns over 1 year message when yearStarted is current year", () => {
            let currentYear = new Date().getFullYear();
            sut.skill.yearStarted = currentYear;
            sut.skill.yearLastUsed = null;

            let actual = sut.DisplayYearRange;

            expect(actual).toEqual("over 1 year");
        });
        it("returns up to message when only yearLastUsed has a value", () => {
            sut.skill.yearStarted = null;

            let actual = sut.DisplayYearRange;

            expect(actual).toEqual("up to " + sut.skill.yearLastUsed);
        });
    });
});