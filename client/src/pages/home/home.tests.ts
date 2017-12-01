import Home from "./home";
import { INotify } from "../../services/notify";
import { ICategoriesService, Category, CategoryGroup } from "../../services/api/categoriesService";
import { IProfileService, CategoryFilter } from "../../services/api/profileService";
import ProfileResult from "../../services/api/profileResult";
import Failure from "../../services/failure";

const core = require("../../tests/core");

describe("Home", () => {
    let categoriesService: ICategoriesService;
    let profileService: IProfileService;
    let notify: INotify;
    let categories: Array<Category>;
    let profiles: Array<ProfileResult>;
    
    let sut: Home;

    beforeEach(() => {
        categories = new Array<Category>(
            <Category>{
                group: CategoryGroup.Skill,
                name: "C#",
                linkCount: 123
            },
            <Category>{
                group: CategoryGroup.Language,
                name: "English",
                linkCount: 455
            },
            <Category>{
                group: CategoryGroup.Gender,
                name: "Female",
                linkCount: 945
            },
            <Category>{
                group: CategoryGroup.Skill,
                name: "C++",
                linkCount: 653
            }
        );
        categoriesService = <ICategoriesService>{
            getCategories: (): Promise<Array<Category>> => {
                return Promise.resolve(categories);
            }
        };
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

        sut = new Home();

        sut.configure(categoriesService, profileService, notify);
    });

    describe("OnLoad", () => {
        it("loads languages", core.runAsync(async () => {
            await sut.OnLoad();

            expect(sut.languages.length).toEqual(1);
            expect(sut.languages[0]).toEqual(categories[1]);
        }));
        it("ignores languages with 0 linkCount", core.runAsync(async () => {
            categories.push(<Category>{
                group: "language",
                name: "Spanish",
                linkCount: 0
            });

            await sut.OnLoad();

            expect(sut.languages.length).toEqual(1);
            expect(sut.languages[0]).toEqual(categories[1]);
        }));
        it("loads genders", core.runAsync(async () => {
            await sut.OnLoad();

            expect(sut.genders.length).toEqual(1);
            expect(sut.genders[0]).toEqual(categories[2]);
        }));
        it("ignores genders with 0 linkCount", core.runAsync(async () => {
            categories.push(<Category>{
                group: "gender",
                name: "Male",
                linkCount: 0
            });
            
            await sut.OnLoad();

            expect(sut.languages.length).toEqual(1);
            expect(sut.languages[0]).toEqual(categories[1]);
        }));
        it("loads skills", core.runAsync(async () => {
            await sut.OnLoad();

            expect(sut.skills.length).toEqual(2);
            expect(sut.skills[0]).toEqual(categories[0]);
            expect(sut.skills[1]).toEqual(categories[3]);
        }));
        it("sets loadingLists to false", core.runAsync(async () => {
            await sut.OnLoad();

            expect(sut.loadingLists).toBeFalsy();
        }));
        it("ignores skills with 0 linkCount", core.runAsync(async () => {
            categories.push(<Category>{
                group: "skill",
                name: "WPFz",
                linkCount: 0
            });
            
            await sut.OnLoad();

            expect(sut.languages.length).toEqual(1);
            expect(sut.languages[0]).toEqual(categories[1]);
        }));
    });

    describe("FiltersSelected", () => {
        it("return false when no filters selected", () => {
            let actual = sut.FiltersSelected;

            expect(actual).toBeFalsy();
        });
        it("return true when skill filter selected", () => {
            sut.selectedSkills.push("C#");

            let actual = sut.FiltersSelected;

            expect(actual).toBeTruthy();
        });
        it("return true when gender filter selected", () => {
            sut.selectedGenders.push("Female");

            let actual = sut.FiltersSelected;

            expect(actual).toBeTruthy();
        });
        it("return true when language filter selected", () => {
            sut.selectedLanguages.push("English");

            let actual = sut.FiltersSelected;

            expect(actual).toBeTruthy();
        });
    });

    describe("OnSearch", () => {
        it("determines filters from selected categories", core.runAsync(async () => {
            let spy = spyOn(profileService, "searchProfiles");

            sut.selectedSkills.push("C#");
            sut.selectedGenders.push("Female");
            sut.selectedLanguages.push("English");

            await sut.OnSearch();

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
              
            await sut.OnSearch();

            expect(notify.showFailure).toHaveBeenCalledWith(expected);
        }));
        it("displays notification when searching profiles throws unknown failure", core.runAsync(async () => {
            let expected = new Error("Uh oh!");

            spyOn(notify, "showError");

            profileService.searchProfiles = (filters: Array<CategoryFilter>): Promise<Array<ProfileResult>> => {
                throw expected;
            };
            
            try {
                await sut.OnSearch();
            }
            catch (e) {
                expect(e).toEqual(expected);
            }

            expect(notify.showError).toHaveBeenCalled();
        }));
        it("returns profile results", core.runAsync(async () => {
            await sut.OnSearch();

            expect(sut.profiles).toEqual(profiles);
        }));
        it("sets flags after search", core.runAsync(async () => {
            await sut.OnSearch();

            expect(sut.searching).toBeFalsy();
            expect(sut.searchRun).toBeTruthy();
        }));
        it("sets flags when searching profiles throws unknown failure", core.runAsync(async () => {
            let expected = new Failure("Uh oh!");

            profileService.searchProfiles = (filters: Array<CategoryFilter>): Promise<Array<ProfileResult>> => {
                throw expected;
            };
                
            await sut.OnSearch();
            
            expect(sut.searching).toBeFalsy();
            expect(sut.searchRun).toBeTruthy();
        }));
    });
});