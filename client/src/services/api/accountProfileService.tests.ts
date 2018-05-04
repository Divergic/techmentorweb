import { Skill } from "./skill";
import { AccountProfileService, AccountProfile, ProfileStatus, ExportPhoto, ExportProfile } from "./accountProfileService";
import { IHttp } from "../http";
import { Comparer } from "../../tests/comparer";

describe("AccountProfile", () => {
    let source: AccountProfile;
    
    beforeEach(function () {
        source = <AccountProfile>{
            about: "My profile about information",
            acceptCoC: true,
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
            expect(actual.acceptCoC).toBeFalsy();
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

describe("ExportPhoto", () => {
    let source: ExportPhoto;
    
    beforeEach(function () {
        source = <ExportPhoto>{
            contentType: "image/jpeg",
            data: new Uint8Array([0, 1, 23, 12, 43, 233, 197]),
            hash: "some hash",
            id: "photo id",
            profileId: "profile id"
        };
    });

    describe("constructor", () => {
        it("sets default values when no photo provided", () => {
            let actual = new ExportPhoto();

            expect(actual.contentType).toBeNull();
            expect(actual.data).toBeDefined();
            expect((<any>actual.data).length).toEqual(0);
            expect(actual.hash).toBeNull();
            expect(actual.id).toBeNull();
            expect(actual.profileId).toBeNull();
        });
        it("copies values from source photo", () => {
            let actual = new ExportPhoto(source);
            let comparer = new Comparer();

            expect(comparer.IsEquivalent(source, actual)).toBeTruthy();
        });
    });
});

describe("ExportProfile", () => {
    let source: ExportProfile;
    
    beforeEach(function () {
        source = <ExportProfile>{
            about: "My profile about information",
            acceptCoC: true,
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
            photos: <Array<ExportPhoto>>[
                <ExportPhoto>{
                    contentType: "image/jpeg",
                    data: new Uint8Array([0, 1, 23, 12, 43, 233, 197]),
                    hash: "some hash",
                    id: "photo id",
                    profileId: "profile id"
                }
            ],
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
            let actual = new ExportProfile();

            expect(actual.about).toBeNull();
            expect(actual.acceptCoC).toBeFalsy();
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
            expect((<any>actual.photos).length).toEqual(0);
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
            let actual = new ExportProfile(source);
            let comparer = new Comparer();

            expect(comparer.IsEquivalent(source, actual)).toBeTruthy();
        });
    });
});

describe("ProfileService", () => {
    let profile: AccountProfile;
    let exportProfile: ExportProfile;
    let http: IHttp;
    let sut: AccountProfileService;

    beforeEach(function () {
        profile = <AccountProfile>{
            timeZone: "Australia/Canberra",
            email: "here@test.com",
            firstName: "Barry",
            lastName: "Goods"
        };
        exportProfile = <ExportProfile>{
            timeZone: "Australia/Perth",
            email: "here@there.com",
            firstName: "Sue",
            lastName: "Goods"
        };
        http = <IHttp>{
            delete: async (resource: string): Promise<void> => {
            },
            get: async (resource: string): Promise<AccountProfile> => {
                if (resource.indexOf("export") > -1) {
                    return exportProfile;
                }

                return profile;
            },
            put: async (resource: string, profile: AccountProfile): Promise<void> => {
            }
        };

        sut = new AccountProfileService(http);          
    });

    describe("deleteAccountProfile", () => {
        it("removes profile from API", async () => {
            spyOn(http, "delete").and.callThrough();

            await sut.deleteAccountProfile();

            expect(http.delete).toHaveBeenCalledWith("profile/");
        });
    });

    describe("exportAccountProfile", () => {
        it("returns profile from API", async () => {
            spyOn(http, "get").and.callThrough();

            let actual = await sut.exportAccountProfile();

            expect(http.get).toHaveBeenCalledWith("profile/export/");
            expect(actual).toEqual(exportProfile);
        });
    });

    describe("getAccountProfile", () => {
        it("returns profile from API", async () => {
            spyOn(http, "get").and.callThrough();

            let actual = await sut.getAccountProfile();

            expect(http.get).toHaveBeenCalledWith("profile/");
            expect(actual).toEqual(profile);
        });
    });

    describe("updateAccountProfile", () => {
        it("puts profile to API", async () => {
            spyOn(http, "put").and.callThrough();

            await sut.updateAccountProfile(profile);

            expect(http.put).toHaveBeenCalledWith("profile/", profile);
        });
    });
});