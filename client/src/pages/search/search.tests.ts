import Search from "./search";
import { INotify } from "../../services/notify";
import { IProfileService, CategoryFilter } from "../../services/api/profileService";
import ProfileResult from "../../services/api/profileResult";
import Failure from "../../services/failure";

const core = require("../../tests/core");

describe("Search", () => {
    let profileService: IProfileService;
    let notify: INotify;
    let profiles: Array<ProfileResult>;
    
    let sut: Search;

    beforeEach(() => {
        // Cancel out the console calls to avoid noisy logging in tests
        spyOn(console, "info");

        profiles = new Array<ProfileResult>(
            <ProfileResult>{
                firstName: "Fred",
                lastName: "Jones"
            }
        );
        profileService = <IProfileService>{
            searchProfiles: (filters: Array<CategoryFilter>): Promise<Array<ProfileResult>> => {
                return Promise.resolve(profiles);
            }
        };
        notify = <INotify>{
            showInformation: (message: string): void => {                
            },
            showFailure: (failure: Failure): void => {
            },
            showWarning: (message: string): void => {                
            },
            showSuccess: (message: string): void => {                
            },
            showError: (message: string): void => {                
            }
        };

        sut = new Search();

        sut.$router = <any>{
            push: (options: any): void => {                
            }
        };

        sut.configure(profileService, notify);
    });

    describe("OnRunSearch", () => {
        it("determines filters from selected categories", core.runAsync(async () => {
            let spy = spyOn(profileService, "searchProfiles");

            let gender = "Female";
            let languages = new Array<string>("English");
            let skills = new Array<string>("C#");

            await sut.OnRunSearch(gender, languages, skills);

            expect(profileService.searchProfiles).toHaveBeenCalled();
            expect(spy.calls.mostRecent().args[0].length).toEqual(3);
            expect(spy.calls.mostRecent().args[0][0].group).toEqual("skill");
            expect(spy.calls.mostRecent().args[0][0].name).toEqual("C#");
            expect(spy.calls.mostRecent().args[0][1].group).toEqual("language");
            expect(spy.calls.mostRecent().args[0][1].name).toEqual("English");
            expect(spy.calls.mostRecent().args[0][2].group).toEqual("gender");
            expect(spy.calls.mostRecent().args[0][2].name).toEqual("Female");
        }));
        it("displays notification when searching profiles throws known failure", core.runAsync(async () => {
            let expected = new Failure("Uh oh!");

            spyOn(notify, "showFailure");

            profileService.searchProfiles = (filters: Array<CategoryFilter>): Promise<Array<ProfileResult>> => {
                throw expected;
            };
              
            let gender = "Female";
            let languages = new Array<string>("English");
            let skills = new Array<string>("C#");

            await sut.OnRunSearch(gender, languages, skills);

            expect(notify.showFailure).toHaveBeenCalledWith(expected);
        }));
        it("displays notification when searching profiles throws unknown failure", core.runAsync(async () => {
            let expected = new Error("Uh oh!");

            spyOn(notify, "showError");

            profileService.searchProfiles = (filters: Array<CategoryFilter>): Promise<Array<ProfileResult>> => {
                throw expected;
            };
            
            let gender = "Female";
            let languages = new Array<string>("English");
            let skills = new Array<string>("C#");

            try {
                await sut.OnRunSearch(gender, languages, skills);    
            }
            catch (e) {
                expect(e).toEqual(expected);
            }

            expect(notify.showError).toHaveBeenCalled();
        }));
        it("returns profile results", core.runAsync(async () => {
            let gender = "Female";
            let languages = new Array<string>("English");
            let skills = new Array<string>("C#");

            await sut.OnRunSearch(gender, languages, skills);

            expect(sut.profiles).toEqual(profiles);
        }));
        it("sets flags after search", core.runAsync(async () => {
            let gender = "Female";
            let languages = new Array<string>("English");
            let skills = new Array<string>("C#");

            await sut.OnRunSearch(gender, languages, skills);

            expect(sut.searching).toBeFalsy();
            expect(sut.searchRun).toBeTruthy();
        }));
        it("sets flags when searching profiles throws unknown failure", core.runAsync(async () => {
            let expected = new Failure("Uh oh!");

            profileService.searchProfiles = (filters: Array<CategoryFilter>): Promise<Array<ProfileResult>> => {
                throw expected;
            };
                
            let gender = "Female";
            let languages = new Array<string>("English");
            let skills = new Array<string>("C#");

            await sut.OnRunSearch(gender, languages, skills);

            expect(sut.searching).toBeFalsy();
            expect(sut.searchRun).toBeTruthy();
        }));
    });
});