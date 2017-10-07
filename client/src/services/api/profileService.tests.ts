import { IHttp } from "../http";
import { Skill } from "./skill";
import { ProfileService, CategoryFilter } from "./profileService";
import UserProfile from "./userProfile";
import ProfileResult from "./profileResult";
import { Comparer } from "../../tests/comparer";

const core = require("../../tests/core");

describe("ProfileService", () => {
    let http: IHttp;
    let sut: ProfileService;

    describe("getProfile", () => {
        let profile: UserProfile;

        beforeEach(() => {
            profile = <UserProfile><any>{
                id: "someid",
                about: "My profile about information",
                birthYear: 1974,
                firstName: "Barry",
                gender: "male",
                gitHubUsername: "barrygoods",
                languages: <Array<string>>["English", "Spanish"],
                lastName: "Goods",
                timeZone: "Australia/Canberra",
                skills: <Array<Skill>>[
                    <Skill>{
                        name: "C#",
                        level: "expert",
                        yearStarted: 1991,
                        yearLastUsed: 2014
                    }
                ],
                status: "available",
                twitterUsername: "twitgoods",
                website: "https://www.goods.com",
                yearStartedInTech: 1990
            };

            http = <IHttp>{
                get: async (uri) => {
                    return profile;
                }
            }
            sut = new ProfileService(http);
        });
        
        it("returns profile from service", core.runAsync(async () => {
            let id = "someIdValue";
            let comparer = new Comparer();

            let actual = await sut.getProfile(id);

            expect(comparer.IsEquivalent(profile, actual)).toBeTruthy();         
        }));

        it("returns initialized UserProfile object", core.runAsync(async () => {
            let id = "someIdValue";

            let actual = await sut.getProfile(id);

            expect(actual.DisplayAge).toBeDefined();
        }));

        it("provides id to service", core.runAsync(async () => {
            let spy = spyOn(http, "get").and.callThrough();
            let id = "someIdValue";
            let expectedUri = "profiles/" + id;

            await sut.getProfile(id);

            expect(spy.calls.argsFor(0)[0]).toEqual(expectedUri);
        }));

        it("encodes id value for service", core.runAsync(async () => {
            let spy = spyOn(http, "get").and.callThrough();
            let id = "some Id Value";
            let expectedUri = "profiles/some%20Id%20Value";

            await sut.getProfile(id);

            expect(spy.calls.argsFor(0)[0]).toEqual(expectedUri);
        }));
    });

    describe("searchProfiles", () => {
        let results: Array<ProfileResult>;

        beforeEach(() => {
            results = <Array<ProfileResult>>[
                <ProfileResult>{
                    id: "first",
                    birthYear: 1970,
                    firstName: "Fred",
                    gender: "male",
                    lastName: "Jones",
                    status: "available",
                    timeZone: "Australia/Sydney",
                    yearStartedInTech: 1999
                }
            ];

            http = <IHttp>{
                get: async (uri) => {
                    return results;
                }
            }
            sut = new ProfileService(http);
        });
        
        it("returns profiles from service", core.runAsync(async () => {
            let filters = new Array<CategoryFilter>();
            let comparer = new Comparer();
            
            let actual = await sut.searchProfiles(filters);
           
            expect(comparer.IsEquivalent(results, actual)).toBeTruthy();     
        }));

        it("returns initialized ProfileResult objects", core.runAsync(async () => {
            let filters = new Array<CategoryFilter>();
            
            let actual = await sut.searchProfiles(filters);

            let profile = actual[0];
            
            expect(profile.DisplayAge).toBeDefined();
        }));

        it("searches all profiles when no filters provided", core.runAsync(async () => {
            let spy = spyOn(http, "get").and.callThrough();
            let expectedUri = "profiles/";

            let filters = new Array<CategoryFilter>();
            
            await sut.searchProfiles(filters);

            expect(spy.calls.argsFor(0)[0]).toEqual(expectedUri);
        }));

        it("searches profiles with single filter", core.runAsync(async () => {
            let spy = spyOn(http, "get").and.callThrough();
            let filter = <CategoryFilter>{group: "gender", name: "female"};
            let filters = <Array<CategoryFilter>>[
                filter
            ];
            let expectedUri = "profiles/?gender=female";
            
            await sut.searchProfiles(filters);

            expect(spy.calls.argsFor(0)[0]).toEqual(expectedUri);
        }));

        it("searches profiles with multiple filters", core.runAsync(async () => {
            let spy = spyOn(http, "get").and.callThrough();
            let firstFilter = <CategoryFilter>{group: "gender", name: "female"};
            let secondFilter = <CategoryFilter>{group: "skill", name: "Azure"};
            let filters = <Array<CategoryFilter>>[
                firstFilter,
                secondFilter
            ];
            let expectedUri = "profiles/?gender=female&skill=Azure";
            
            await sut.searchProfiles(filters);

            expect(spy.calls.argsFor(0)[0]).toEqual(expectedUri);
        }));

        it("encodes profiles with multiple filters", core.runAsync(async () => {
            let spy = spyOn(http, "get").and.callThrough();
            let firstFilter = <CategoryFilter>{group: "language", name: "US English"};
            let secondFilter = <CategoryFilter>{group: "skill", name: "C#"};
            let filters = <Array<CategoryFilter>>[
                firstFilter,
                secondFilter
            ];
            let expectedUri = "profiles/?language=US%20English&skill=C" + encodeURIComponent("#");
            
            await sut.searchProfiles(filters);

            expect(spy.calls.argsFor(0)[0]).toEqual(expectedUri);
        }));
    });
});