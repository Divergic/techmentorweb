import { ListsService } from "./listsService";
import Timezones from "tz-ids/index.jsnext.js";

describe("ListsService", () => {
    let sut: ListsService;

    beforeEach(() => {
        sut = new ListsService();
    });

    describe("getBirthYears", () => {
        it("returns the last 100 years to last 10 years in descending order", () => {
            let actual = sut.getBirthYears();

            let startYear = new Date().getFullYear() - 10;

            expect(actual.length).toEqual(91);

            for (let index = 0; index < 91; index++) {
                expect(actual[index]).toEqual(startYear - index);
            }
        });
    });

    describe("getProfileStatuses", () => {
        it("returns status values", () => {
            let actual = sut.getProfileStatuses();

            expect(actual[0].name).toEqual("Hidden");
            expect(actual[0].value).toEqual("hidden");
            expect(actual[1].name).toEqual("Unavailable");
            expect(actual[1].value).toEqual("unavailable");
            expect(actual[2].name).toEqual("Available");
            expect(actual[2].value).toEqual("available");
        });
    });

    describe("getSkillLevels", () => {
        it("returns skill levels", () => {
            let actual = sut.getSkillLevels();

            expect(actual[0].name).toEqual("Hobbyist");
            expect(actual[0].value).toEqual("hobbyist");
            expect(actual[1].name).toEqual("Beginner");
            expect(actual[1].value).toEqual("beginner");
            expect(actual[2].name).toEqual("Intermediate");
            expect(actual[2].value).toEqual("intermediate");
            expect(actual[3].name).toEqual("Expert");
            expect(actual[3].value).toEqual("expert");
            expect(actual[4].name).toEqual("Master");
            expect(actual[4].value).toEqual("master");
        });
    });

    describe("getTechYears", () => {
        it("returns the years since 1989 in descending order", () => {
            let actual = sut.getTechYears();

            let currentYear = new Date().getFullYear();
            let maxYears = currentYear - 1989 + 1;

            expect(actual.length).toEqual(maxYears);

            for (let index = 0; index < maxYears; index++) {
                expect(actual[index]).toEqual(currentYear - index);
            }
        });
    });

    describe("getTimezones", () => {
        it("returns zones", () => {
            let actual = sut.getTimezones();

            expect(actual).toEqual(Timezones);
        });
    });
});