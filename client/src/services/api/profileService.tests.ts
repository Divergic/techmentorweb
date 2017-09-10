import { ProfileService, UserProfile } from "./profileService";
import { IHttp } from "../http";

const core = require("../../tests/core");

describe("profileService.ts", () => {
    let profile: UserProfile;
    let http: IHttp;
    let sut: ProfileService;

    beforeEach(function () {
        profile = <UserProfile>{
            timeZone: "Australia/Canberra",
            email: "here@test.com",
            firstName: "Barry",
            lastName: "Goods"
        };
        http = <IHttp>{
            get: async (resource: string): Promise<UserProfile> => {
                return profile;
            },
            put: async (resource: string, profile: UserProfile): Promise<void> => {
            }
        };

        sut = new ProfileService(http);          
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