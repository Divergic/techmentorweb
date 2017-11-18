import { Skill } from "./skill";
import { AccountProfileService, AccountProfile, ProfileStatus } from "./accountProfileService";
import { IHttp } from "../http";
import { Comparer } from "../../tests/comparer";

const core = require("../../tests/core");

describe("UserProfile", () => {
    let source: AccountProfile;
    
    beforeEach(function () {
        source = <AccountProfile>{
            about: "My profile about information",
            bannedAt: new Date(),
            birthYear: 1974,
            email: "here@test.com",
            firstName: "Barry",
            gender: "male",
            gitHubUsername: "barrygoods",
            id: "someid",
            languages: <Array<string>>["English", "Spanish"],
            lastName: "Goods",
            photoHash: "0x8D52834540295D4",
            photoId: "15ca4c24-7118-404a-a054-01ddd1a36a94",
            skills: <Array<Skill>>[
                <Skill>{
                    name: "C#",
                    level: "expert",
                    yearStarted: 1991,
                    yearLastUsed: 2014
                }
            ],
            status: "available",
            timeZone: "Australia/Canberra",
            twitterUsername: "twitgoods",
            website: "https://www.goods.com",
            yearStartedInTech: 1990
        };
    });

    describe("constructor", () => {
        it("sets default values when no profile provided", () => {
            let actual = new AccountProfile();

            expect(actual.about).toBeNull();
            expect(actual.bannedAt).toBeNull();
            expect(actual.birthYear).toBeNull();
            expect(actual.email).toBeNull();
            expect(actual.firstName).toBeNull();
            expect(actual.gender).toBeNull();
            expect(actual.gitHubUsername).toBeNull();
            expect(actual.id).toBeNull();
            expect(actual.languages).toBeDefined();
            expect((<any>actual.languages).length).toEqual(0);
            expect(actual.lastName).toBeNull();
            expect(actual.photoHash).toBeNull();
            expect(actual.photoId).toBeNull();
            expect(actual.email).toBeNull();
            expect(actual.skills).toBeDefined();
            expect((<any>actual.skills).length).toEqual(0);
            expect(actual.status).toEqual(ProfileStatus.Hidden);
            expect(actual.timeZone).toBeNull();
            expect(actual.twitterUsername).toBeNull();
            expect(actual.website).toBeNull();
            expect(actual.yearStartedInTech).toBeNull();
        });
        it("copies values from source profile", () => {
            let actual = new AccountProfile(source);
            let comparer = new Comparer();

            expect(comparer.IsEquivalent(source, actual)).toBeTruthy();
        });
    });
});

describe("ProfileService", () => {
    let profile: AccountProfile;
    let http: IHttp;
    let sut: AccountProfileService;

    beforeEach(function () {
        profile = <AccountProfile>{
            timeZone: "Australia/Canberra",
            email: "here@test.com",
            firstName: "Barry",
            lastName: "Goods"
        };
        http = <IHttp>{
            get: async (resource: string): Promise<AccountProfile> => {
                return profile;
            },
            put: async (resource: string, profile: AccountProfile): Promise<void> => {
            }
        };

        sut = new AccountProfileService(http);          
    });

    describe("getAccountProfile", () => {
        it("returns profile from API", core.runAsync(async () => {
            spyOn(http, "get").and.callThrough();

            let actual = await sut.getAccountProfile();

            expect(http.get).toHaveBeenCalledWith("profile/");
            expect(actual).toEqual(profile);
        }));
    });

    describe("updateAccountProfile", () => {
        it("puts profile to API", core.runAsync(async () => {
            spyOn(http, "put").and.callThrough();

            await sut.updateAccountProfile(profile);

            expect(http.put).toHaveBeenCalledWith("profile/", profile);
        }));
    });
});