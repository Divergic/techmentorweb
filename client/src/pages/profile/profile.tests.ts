import Profile from "./profile";
import { IProfileService } from "../../services/api/profileService";
import UserProfile from "../../services/api/userProfile";
import Failure from "../../services/failure";
import { INotify } from "../../services/notify";
import { Skill } from "../../services/api/skill";

const core = require("../../tests/core");

describe("Profile", () => {
    let profileService: IProfileService;
    let notify: INotify;
    let profile: UserProfile;
    let id = "someProfileId";

    let sut: Profile;

    beforeEach(() => {
        profile = <UserProfile>{
            firstName: "Sue",
            lastName: "Wise"
        };
        profileService = <IProfileService>{
            getProfile: (id: string): Promise<UserProfile> => {
                return Promise.resolve(profile);
            }
        };
        notify = <INotify>{
            showFailure: (failure: Failure): void => {
            }
        };

        sut = new Profile();

        sut.configure(profileService, notify);

        sut.$route = <any>{
            params: {
                id: id
            }
        };
        sut.$router = <any>{
            push: (route: any) => {
            }
        };
    });

    describe("OnLoad", () => {
        it("loads profile from service", core.runAsync(async () => {
            await sut.OnLoad();

            expect(sut.model).toEqual(profile);
        }));
        it("sets compiledMarkdown to empty when about is null", core.runAsync(async () => {
            profile.about = null;

            await sut.OnLoad();

            expect(sut.compiledMarkdown).toEqual("");
        }));
        it("sets compiledMarkdown to compiled markdown when about has value", core.runAsync(async () => {
            profile.about = "- stuff";
            
            await sut.OnLoad();

            let actual = sut.compiledMarkdown.replace(/\r?\n|\r/g, "");
            
            expect(actual).toEqual("<ul><li>stuff</li></ul>");
        }));
        it("gets for profile by route id", core.runAsync(async () => {
            let spy = spyOn(profileService, "getProfile").and.callThrough();

            await sut.OnLoad();
            
            expect(profileService.getProfile).toHaveBeenCalled();
            expect(spy.calls.mostRecent().args[0]).toEqual(id);
        }));
        it("displays notification when getting profile throws known failure", core.runAsync(async () => {
            let expected = new Failure("Uh oh!");

            spyOn(notify, "showFailure");

            profileService.getProfile = (id: string): Promise<UserProfile> => {
                throw expected;
            };
              
            await sut.OnLoad();

            expect(notify.showFailure).toHaveBeenCalledWith(expected);
        }));
        it("sets empty profile when getting profile throws known failure", core.runAsync(async () => {
            let failure = new Failure("Uh oh!");

            profileService.getProfile = (id: string): Promise<UserProfile> => {
                throw failure;
            };
              
            await sut.OnLoad();

            let expected = new UserProfile();

            expect(sut.model).toEqual(expected);
        }));
        it("redirects to notfound route when failure indictes profile not found", core.runAsync(async () => {
            let expected = new Error("Not Found");

            let spy = spyOn(sut.$router, "push");

            profileService.getProfile = (id: string): Promise<UserProfile> => {
                throw expected;
            };
              
            await sut.OnLoad();
            
            expect(spy.calls.mostRecent().args[0].name).toEqual("notfound");
        }));
        it("throws error when getting profile throws unknown failure", core.runAsync(async () => {
            let expected = new Error("Uh oh!");

            profileService.getProfile = (id: string): Promise<UserProfile> => {
                throw expected;
            };
            
            try {
                await sut.OnLoad();
            }
            catch (e) {
                expect(e).toEqual(expected);
            }
        }));
        it("sets loading to false", core.runAsync(async () => {
            await sut.OnLoad();

            expect(sut.loading).toBeFalsy();
        }));
    });

    describe("HasTechnicalData", () => {
        it("returns false when model is null", () => {
            sut.model = <UserProfile><any>null;

            let actual = sut.HasTechnicalData();

            expect(actual).toBeFalsy();
        });
        it("returns false when model is undefined", () => {
            sut.model = <UserProfile><any>undefined;

            let actual = sut.HasTechnicalData();

            expect(actual).toBeFalsy();
        });
        it("returns true when yearStartedInTech has value", () => {
            sut.model.yearStartedInTech = 2000;

            let actual = sut.HasTechnicalData();

            expect(actual).toBeTruthy();
        });
        it("returns true when website has value", () => {
            sut.model.website = "http://www.somesite.com";

            let actual = sut.HasTechnicalData();

            expect(actual).toBeTruthy();
        });
        it("returns true when gitHubUsername has value", () => {
            sut.model.gitHubUsername = "someusername";

            let actual = sut.HasTechnicalData();

            expect(actual).toBeTruthy();
        });
        it("returns true when twitterUsername has value", () => {
            sut.model.twitterUsername = "someusername";

            let actual = sut.HasTechnicalData();

            expect(actual).toBeTruthy();
        });
        it("returns true when skills have values", () => {
            sut.model.skills.push(
                <Skill>{
                    name: "C#"
                }
            );

            let actual = sut.HasTechnicalData();

            expect(actual).toBeTruthy();
        });
        it("returns false when model lacks technical data", () => {
            let actual = sut.HasTechnicalData();

            expect(actual).toBeFalsy();
        });
    });
});