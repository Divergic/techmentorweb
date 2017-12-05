import Profile from "./accountProfile";
import { IAccountProfileService, AccountProfile } from "../../services/api/accountProfileService";
import Failure from "../../services/failure";
import { INotify } from "../../services/notify";
import { IListsService, ListItem } from "../../services/listsService";
import { ICategoriesService, Category, CategoryGroup } from "../../services/api/categoriesService";
import store from "store";

const core = require("../../tests/core");

describe("AccountProfile", () => {
    let model: AccountProfile;
    let timezones: Array<string>;
    let birthYears: Array<number>;
    let techYears: Array<number>;
    let statuses: Array<ListItem<string>>;
    let categories: Array<Category>;
    let isValid: boolean;

    let sut: Profile;
    let profileService: IAccountProfileService;
    let listsService: IListsService;
    let categoriesService: ICategoriesService;
    let notify: INotify;
    let vuexStore: any;
    let validator: any;
    
    beforeEach(() => {
        store.clearAll();

        model = new AccountProfile(
            <AccountProfile>{
                firstName: "Jane", 
                lastName: "Smith", 
                email: "jane.smith@test.com", 
                languages: new Array<string>("English")
            });
        timezones = new Array<string>("Australia/Canberra", "Australia/Sydney");
        birthYears = new Array<number>(1980, 1981);
        techYears = new Array<number>(1999, 2000);
        statuses = new Array<ListItem<string>>(
            <ListItem<string>>{ name: "Hidden" }, 
            <ListItem<string>>{ name: "Unavailable" }, 
            <ListItem<string>>{ name: "Available" });
        categories = <Array<Category>>[
            <Category>{
                group: CategoryGroup.Skill,
                name: "C#"
            },
            <Category>{
                group: CategoryGroup.Language,
                name: "English"
            },
            <Category>{
                group: CategoryGroup.Gender,
                name: "Female"
            },
            <Category>{
                group: CategoryGroup.Skill,
                name: "C++"
            }
        ];
        isValid = true;

        sut = new Profile();
        profileService = <IAccountProfileService>{
            getAccountProfile: (): Promise<AccountProfile> => {
                return Promise.resolve(model);
            },
            updateAccountProfile: (profile: AccountProfile): Promise<void> => {
                return Promise.resolve();               
            }
        };
        listsService = <IListsService>{
            getTimezones: () => {
                return timezones;
            },
            getBirthYears: () => {
                return birthYears;
            },
            getTechYears: () => {
                return techYears;
            },
            getProfileStatuses: () => {
                return statuses;
            }
        };
        categoriesService = <ICategoriesService>{
            getCategories: () => {
                return Promise.resolve(categories);
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
        vuexStore = {
            getters: {
            },
            commit: function(key: string, value: any) {                
            }
        };
        validator = {
            validateAll: (name: string) => {
                return isValid;
            }
        };
        
        sut.configure(profileService, listsService, categoriesService, notify);
        
        (<any>sut).$store = vuexStore;  
        (<any>sut).$validator = validator;    
    });

    describe("OnLoad", () => {
        it("loads profile from service when not found in store", core.runAsync(async () => {
            await sut.OnLoad();

            expect(sut.model).toEqual(model);
        }));
        it("loads profile from store", core.runAsync(async () => {
            let storedProfile = new AccountProfile(<AccountProfile>{firstName: "Joe", lastName: "Jones", email: "joe.jones@test.com"});

            store.set("profile", storedProfile);

            await sut.OnLoad();

            expect(sut.model).toEqual(storedProfile);
        }));  
        it("displays notification when profile loaded from store", core.runAsync(async () => {
            spyOn(notify, "showInformation");
            spyOn(store, "remove");

            let storedProfile = new AccountProfile(<AccountProfile>{firstName: "Joe", lastName: "Jones", email: "joe.jones@test.com"});

            store.set("profile", storedProfile);

            await sut.OnLoad();

            expect(notify.showInformation).toHaveBeenCalled();
            expect(store.remove).toHaveBeenCalledWith("profile");
        }));  
        it("populates values from authentication when missing", core.runAsync(async () => {
            model.email = <string><any>null;
            model.firstName = <string><any>null;
            model.lastName = <string><any>null;

            vuexStore.getters = {
                email: "authemail",
                firstName: "authfirstname",
                lastName: "authlastName"
            };

            await sut.OnLoad();

            expect(sut.model.email).toEqual(vuexStore.getters.email);
            expect(sut.model.firstName).toEqual(vuexStore.getters.firstName);
            expect(sut.model.lastName).toEqual(vuexStore.getters.lastName);
        }));
        it("displays notification when loading profile throws known failure", core.runAsync(async () => {
            let expected = new Failure("Uh oh!");

            spyOn(notify, "showFailure");

            profileService.getAccountProfile = () => {
                throw expected;
            };
              
            await sut.OnLoad();

            expect(notify.showFailure).toHaveBeenCalledWith(expected);
        }));
        it("throws error when loading profile throws unknown failure", core.runAsync(async () => {
            let expected = new Error("Uh oh!");

            spyOn(notify, "showFailure");

            profileService.getAccountProfile = () => {
                throw expected;
            };

            try {
                await sut.OnLoad();
            }
            catch (failure) {
                expect(failure).toEqual(expected);
            }

            expect(notify.showFailure).not.toHaveBeenCalled();
        }));
        it("sets compiledMarkdown to empty when about is null", core.runAsync(async () => {
            model.about = null;

            await sut.OnLoad();

            expect(sut.compiledMarkdown).toEqual("");
        }));
        it("sets compiledMarkdown to compiled markdown when about has value", core.runAsync(async () => {
            model.about = "- stuff";

            await sut.OnLoad();

            let actual = sut.compiledMarkdown.replace(/\r?\n|\r/g, "");

            expect(actual).toEqual("<ul><li>stuff</li></ul>");
        }));
        it("loads timezones", core.runAsync(async () => {
            await sut.OnLoad();

            expect(sut.timezones).toEqual(timezones);
        }));
        it("loads birthYears", core.runAsync(async () => {
            await sut.OnLoad();

            expect(sut.birthYears).toEqual(birthYears);
        }));
        it("loads techYears", core.runAsync(async () => {
            await sut.OnLoad();

            expect(sut.techYears).toEqual(techYears);
        }));
        it("loads statuses", core.runAsync(async () => {
            await sut.OnLoad();

            expect(sut.statuses).toEqual(statuses);
        }));
        it("loads languages", core.runAsync(async () => {
            await sut.OnLoad();

            expect(sut.languages.length).toEqual(1);
            expect(sut.languages[0]).toEqual("English");
        }));
        it("loads genders", core.runAsync(async () => {
            await sut.OnLoad();

            expect(sut.genders.length).toEqual(1);
            expect(sut.genders[0]).toEqual("Female");
        }));
        it("marks loading as false", core.runAsync(async () => {
            await sut.OnLoad();

            let actual = sut.loading;

            expect(actual).toBeFalsy();
        }));
    });

    describe("OnSave", () => {
        it("shows notification when validation fails", core.runAsync(async () => {
            spyOn(profileService, "updateAccountProfile");
            spyOn(notify, "showWarning");

            isValid = false;

            await sut.OnLoad();
            await sut.OnSave();

            expect(profileService.updateAccountProfile).not.toHaveBeenCalled();
            expect(notify.showWarning).toHaveBeenCalled();
        }));
        it("shows notification on successful save", core.runAsync(async () => {
            spyOn(store, "set").and.callThrough();
            spyOn(profileService, "updateAccountProfile");
            spyOn(store, "remove").and.callThrough();
            spyOn(notify, "showSuccess");
            
            await sut.OnLoad();
            await sut.OnSave();

            expect(store.set).toHaveBeenCalledWith("profile", model);
            expect(profileService.updateAccountProfile).toHaveBeenCalledWith(model);
            expect(store.remove).toHaveBeenCalledWith("profile");
            expect(notify.showSuccess).toHaveBeenCalled();
        }));
        it("shows failiure notification on known save failure", core.runAsync(async () => {
            spyOn(store, "set").and.callThrough();
            spyOn(store, "remove").and.callThrough();
            spyOn(notify, "showFailure");

            let failure = new Failure("Uh oh!");

            profileService.updateAccountProfile = (profile: AccountProfile): Promise<void> => {
                return Promise.reject(failure);
            };
            
            await sut.OnLoad();
            await sut.OnSave();

            expect(store.set).toHaveBeenCalledWith("profile", model);
            expect(store.remove).not.toHaveBeenCalledWith();
            expect(notify.showFailure).toHaveBeenCalled();
        }));
        it("shows error notification and throws error on unknown save failure", core.runAsync(async () => {
            spyOn(store, "set").and.callThrough();
            spyOn(store, "remove").and.callThrough();
            spyOn(notify, "showError");

            let failure = new Error("Uh oh!");

            profileService.updateAccountProfile = (profile: AccountProfile): Promise<void> => {
                return Promise.reject(failure);
            };
            
            await sut.OnLoad();

            try {
                await sut.OnSave();

                throw new Error("Test should have thrown an error");
            }
            catch (e) {
                expect(e).toEqual(failure);
            }

            expect(store.set).toHaveBeenCalledWith("profile", model);
            expect(store.remove).not.toHaveBeenCalledWith();
            expect(notify.showError).toHaveBeenCalled();
        }));
        it("sets savingModel flag around successful save", core.runAsync(async () => {
            profileService.updateAccountProfile = (profile: AccountProfile): Promise<void> => {
                expect(sut.savingModel).toBeTruthy();
                return Promise.resolve();
            };
            
            await sut.OnLoad();
            await sut.OnSave();
            
            expect(sut.savingModel).toBeFalsy();
        }));
        it("sets savingModel flag around failed save", core.runAsync(async () => {
            profileService.updateAccountProfile = (profile: AccountProfile): Promise<void> => {
                expect(sut.savingModel).toBeTruthy();
                return Promise.reject(new Failure("Uh oh!"));
            };
            
            await sut.OnLoad();
            await sut.OnSave();
            
            expect(sut.savingModel).toBeFalsy();
        }));
    });

    describe("ShowWebsite", () => {
        it("opens website uri", () => {
            let uri = "https://www.twitter.com/someuser";

            spyOn(window, "open");

            sut.ShowWebsite(uri);

            expect(window.open).toHaveBeenCalledWith(uri, "_blank");
        });
    });

    describe("OnViewCoCClick", () => {
        it("cancels click event", () => {
            let element = {
                href: "https://www.somwhere.com/",
                target: "_blank"
            };
            let event = <Event><any>{
                srcElement: element,
                stopPropagation: () => {                    
                },
                preventDefault: () => {                    
                }
            };

            spyOn(event, "stopPropagation");
            spyOn(event, "preventDefault");

            sut.OnViewCoCClick(event);

            expect(event.stopPropagation).toHaveBeenCalled();
            expect(event.preventDefault).toHaveBeenCalled();
        });
        it("opens uri with attributes of anchor", () => {
            let element = {
                href: "https://www.somwhere.com/",
                target: "_blank"
            };
            let event = <Event><any>{
                srcElement: element,
                stopPropagation: () => {                    
                },
                preventDefault: () => {                    
                }
            };

            spyOn(window, "open");

            sut.OnViewCoCClick(event);

            expect(window.open).toHaveBeenCalledWith(element.href, element.target);
        });
    });

    describe("CheckLanguages", () => {
        it("updates languages to title case", core.runAsync(async () => {
            model.languages.push("spanish");

            await sut.OnLoad();
            sut.CheckLanguages(model.languages);

            expect(sut.model.languages.length).toEqual(2);
            expect(sut.model.languages[1]).toEqual("Spanish");
        }));
    });

    describe("CompileMarkdown", () => {
        it("sets compiledMarkdown to empty when about is null", core.runAsync(async () => {
            model.about = null;

            await sut.OnLoad();
            sut.CompileMarkdown();

            expect(sut.compiledMarkdown).toEqual("");
        }));
        it("sets compiledMarkdown to compiled markdown when about has value", core.runAsync(async () => {
            model.about = "- stuff";

            await sut.OnLoad();
            sut.CompileMarkdown();

            let actual = sut.compiledMarkdown.replace(/\r?\n|\r/g, "");

            expect(actual).toEqual("<ul><li>stuff</li></ul>");
        }));
    });
});