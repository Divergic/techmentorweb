import UserProfile from "./userProfile";
import { Skill } from "./skill";
import { Comparer } from "../../tests/comparer";

describe("UserProfile", () => {
    let sut: UserProfile;

    beforeEach(() => {
        sut = new UserProfile();
        sut.id = "someid";
        sut.about = "My profile about information";
        sut.birthYear = 1974;
        sut.firstName = "Barry";
        sut.gender = "male";
        sut.gitHubUsername = "barrygoods";
        sut.languages = <Array<string>>["English", "Spanish"],
        sut.lastName = "Goods";
        sut.skills = <Array<Skill>>[
            <Skill>{
                name: "C#",
                level: "expert",
                yearStarted: 1991,
                yearLastUsed: 2014
            }
        ],
        sut.status = "available";
        sut.timeZone = "Australia/Canberra";
        sut.twitterUsername = "twitgoods";
        sut.website = "https://www.goods.com";
        sut.yearStartedInTech = 1990;
    });

    describe("constructor", () => {
        it("initialises with default values when source is not specified", () => {
            let actual = new UserProfile();

            expect(actual.id).toBeNull();
            expect(actual.about).toBeNull();
            expect(actual.birthYear).toBeNull();
            expect(actual.firstName).toBeNull();
            expect(actual.gender).toBeNull();
            expect(actual.gitHubUsername).toBeNull();
            expect(actual.languages.length).toEqual(0);
            expect(actual.lastName).toBeNull();
            expect(actual.skills.length).toEqual(0);
            expect(actual.status).toBeNull();
            expect(actual.timeZone).toBeNull();
            expect(actual.twitterUsername).toBeNull();
            expect(actual.website).toBeNull();
            expect(actual.yearStartedInTech).toBeNull();
        });
        it("initialises with default values when source is null", () => {
            let actual = new UserProfile(null);

            expect(actual.id).toBeNull();
            expect(actual.about).toBeNull();
            expect(actual.birthYear).toBeNull();
            expect(actual.firstName).toBeNull();
            expect(actual.gender).toBeNull();
            expect(actual.gitHubUsername).toBeNull();
            expect(actual.languages.length).toEqual(0);
            expect(actual.lastName).toBeNull();
            expect(actual.skills.length).toEqual(0);
            expect(actual.status).toBeNull();
            expect(actual.timeZone).toBeNull();
            expect(actual.twitterUsername).toBeNull();
            expect(actual.website).toBeNull();
            expect(actual.yearStartedInTech).toBeNull();
        });
        it("initialises with default values when source is undefined", () => {
            let actual = new UserProfile(undefined);

            expect(actual.id).toBeNull();
            expect(actual.about).toBeNull();
            expect(actual.birthYear).toBeNull();
            expect(actual.firstName).toBeNull();
            expect(actual.gender).toBeNull();
            expect(actual.gitHubUsername).toBeNull();
            expect(actual.languages.length).toEqual(0);
            expect(actual.lastName).toBeNull();
            expect(actual.skills.length).toEqual(0);
            expect(actual.status).toBeNull();
            expect(actual.timeZone).toBeNull();
            expect(actual.twitterUsername).toBeNull();
            expect(actual.website).toBeNull();
            expect(actual.yearStartedInTech).toBeNull();
        });
        it("initialises with source values", () => {
            let actual = new UserProfile(sut);

            let comparer = new Comparer();

            expect(comparer.IsEquivalent(sut, actual)).toBeTruthy();
        });
        it("sets new languages and skills instance when missing from source", () => {
            sut.languages = <Array<string>><any>null;
            sut.skills = <Array<Skill>><any>null;

            let actual = new UserProfile(sut);

            expect(actual.languages.length).toEqual(0);
            expect(actual.skills.length).toEqual(0);
        });
    });

});