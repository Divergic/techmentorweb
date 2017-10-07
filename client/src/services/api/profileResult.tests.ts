import ProfileResult from "./profileResult";
import { Comparer } from "../../tests/comparer";

describe("ProfileResult", () => {
    let sut: ProfileResult;

    beforeEach(() => {
        sut = new ProfileResult();
        sut.birthYear = 1974;
        sut.gender = "male";
        sut.status = "available";
        sut.yearStartedInTech = 1990;
        sut.firstName = "Barry";
        sut.lastName = "Goods";
        sut.timeZone = "Australia/Canberra";
    });

    describe("constructor", () => {
        it("initialises with default values when source is not specified", () => {
            let actual = new ProfileResult();

            expect(actual.id).toBeNull();
            expect(actual.birthYear).toBeNull();
            expect(actual.gender).toBeNull();
            expect(actual.status).toBeNull();
            expect(actual.yearStartedInTech).toBeNull();
            expect(actual.firstName).toBeNull();
            expect(actual.lastName).toBeNull();
            expect(actual.timeZone).toBeNull();
        });
        it("initialises with default values when source is null", () => {
            let actual = new ProfileResult(null);

            expect(actual.id).toBeNull();
            expect(actual.birthYear).toBeNull();
            expect(actual.gender).toBeNull();
            expect(actual.status).toBeNull();
            expect(actual.yearStartedInTech).toBeNull();
            expect(actual.firstName).toBeNull();
            expect(actual.lastName).toBeNull();
            expect(actual.timeZone).toBeNull();
        });
        it("initialises with default values when source is undefined", () => {
            let actual = new ProfileResult(undefined);

            expect(actual.id).toBeNull();
            expect(actual.birthYear).toBeNull();
            expect(actual.gender).toBeNull();
            expect(actual.status).toBeNull();
            expect(actual.yearStartedInTech).toBeNull();
            expect(actual.firstName).toBeNull();
            expect(actual.lastName).toBeNull();
            expect(actual.timeZone).toBeNull();
        });
        it("initialises with source values", () => {
            let actual = new ProfileResult(sut);

            let comparer = new Comparer();

            expect(comparer.IsEquivalent(sut, actual)).toBeTruthy();
        });
    });

    describe("DisplayAge", () => {
        it("returns empty when birthYear is null", () => {
            sut.birthYear = null;

            const actual = sut.DisplayAge;

            expect(actual).toEqual("");
        });
        it("returns empty when birthYear is undefined", () => {
            sut.birthYear = <number><any>undefined;

            const actual = sut.DisplayAge;

            expect(actual).toEqual("");
        });
        it("returns age based on current year", () => {
            let currentYear = new Date().getFullYear();
            let difference = currentYear - <number>sut.birthYear;

            const actual = sut.DisplayAge;

            expect(actual).toEqual(difference.toLocaleString());
        });
    });

    describe("DisplayGender", () => {
        it("returns empty when gender is null", () => {
            sut.gender = null;

            const actual = sut.DisplayGender;

            expect(actual).toEqual("");
        });
        it("returns empty when gender is undefined", () => {
            sut.gender = <string><any>undefined;

            const actual = sut.DisplayGender;

            expect(actual).toEqual("");
        });
        it("returns gender", () => {
            sut.gender = "Female";

            const actual = sut.DisplayGender;

            expect(actual).toEqual(sut.gender);
        });
        it("returns gender as proper case", () => {
            const actual = sut.DisplayGender;

            expect(actual).toEqual("Male");
        });
    });

    describe("DisplayStatus", () => {
        it("returns empty when status is null", () => {
            sut.status = <string><any>null;

            const actual = sut.DisplayStatus;

            expect(actual).toEqual("");
        });
        it("returns empty when status is undefined", () => {
            sut.status = <string><any>undefined;

            const actual = sut.DisplayStatus;

            expect(actual).toEqual("");
        });
        it("returns status", () => {
            sut.status = "Available";

            const actual = sut.DisplayStatus;

            expect(actual).toEqual(sut.status);
        });
        it("returns status as proper case", () => {
            const actual = sut.DisplayStatus;

            expect(actual).toEqual("Available");
        });
    });

    describe("DisplayYearsInTech", () => {
        it("returns empty when yearStartedInTech is null", () => {
            sut.yearStartedInTech = null;

            const actual = sut.DisplayYearsInTech;

            expect(actual).toEqual("");
        });
        it("returns empty when yearStartedInTech is undefined", () => {
            sut.yearStartedInTech = <number><any>undefined;

            const actual = sut.DisplayYearsInTech;

            expect(actual).toEqual("");
        });
        it("returns value based on current year", () => {
            let currentYear = new Date().getFullYear();
            let difference = currentYear - <number>sut.yearStartedInTech;

            const actual = sut.DisplayYearsInTech;

            expect(actual).toEqual(difference.toLocaleString());
        });
        it("returns 1 when yearStartedInTech is current year", () => {
            let currentYear = new Date().getFullYear();
            
            sut.yearStartedInTech = currentYear;

            const actual = sut.DisplayYearsInTech;

            expect(actual).toEqual("1");
        });
        it("returns 1 when yearStartedInTech greater than current year", () => {
            let currentYear = new Date().getFullYear();
            
            sut.yearStartedInTech = currentYear + 1;

            const actual = sut.DisplayYearsInTech;

            expect(actual).toEqual("1");
        });
    });
});
