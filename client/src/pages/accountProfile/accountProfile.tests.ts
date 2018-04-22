import Profile from "./accountProfile";
import { IAccountProfileService, AccountProfile, ExportProfile } from "../../services/api/accountProfileService";
import Failure from "../../services/failure";
import { INotify } from "../../services/notify";
import { IListsService, ListItem } from "../../services/listsService";
import { ICategoriesService, Category, CategoryGroup } from "../../services/api/categoriesService";
import { ILocation } from "../../services/location";
import { IJsonDownloader } from "./jsonDownloader";
import store from "store";

describe("AccountProfile", () => {
    let model: AccountProfile;
    let exportModel: ExportProfile;
    let timezones: Array<string>;
    let birthYears: Array<number>;
    let techYears: Array<number>;
    let statuses: Array<ListItem<string>>;
    let categories: Array<Category>;
    let isValid: boolean;
    let hash: string;

    let sut: Profile;
    let profileService: IAccountProfileService;
    let listsService: IListsService;
    let categoriesService: ICategoriesService;
    let location: ILocation;
    let jsonDownloader: IJsonDownloader;
    let notify: INotify;
    let vuexStore: any;
    let validator: any;
    
    beforeEach(() => {
        // Cancel out the console calls to avoid noisy logging in tests
        spyOn(console, "info");

        store.clearAll();

        model = new AccountProfile(
            <AccountProfile>{
                firstName: "Jane", 
                lastName: "Smith", 
                email: "jane.smith@test.com", 
                languages: new Array<string>("English")
            });
        exportModel = new ExportProfile(
        <ExportProfile>{
            firstName: "Dave", 
            lastName: "Smith", 
            email: "dave.smith@test.com", 
            languages: new Array<string>("Spanish")
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
        hash = "";

        sut = new Profile();
        profileService = <IAccountProfileService>{
            exportAccountProfile: (): Promise<ExportProfile> => {
                return Promise.resolve(exportModel);
            },
            getAccountProfile: (): Promise<AccountProfile> => {
                return Promise.resolve(model);
            },
            updateAccountProfile: (profile: AccountProfile): Promise<void> => {
                return Promise.resolve();               
            },
            deleteAccountProfile: async (): Promise<void> => {
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
        location = <ILocation>{
            getHash: () => {
                return hash;
            }
        };
        jsonDownloader = <IJsonDownloader>{
            download: (name: string, value: any) => {                
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
        
        sut.configure(profileService, listsService, categoriesService, location, jsonDownloader, notify);
        
        (<any>sut).$store = vuexStore;  
        (<any>sut).$validator = validator;    
    });

    describe("OnLoad", () => {
        it("loads profile from service when not found in store", async () => {
            await sut.OnLoad();

            expect(sut.model).toEqual(model);
        });
        it("loads profile from store", async () => {
            let storedProfile = new AccountProfile(<AccountProfile>{firstName: "Joe", lastName: "Jones", email: "joe.jones@test.com"});

            store.set("profile", storedProfile);

            await sut.OnLoad();

            expect(sut.model).toEqual(storedProfile);
        });  
        it("displays notification when profile loaded from store", async () => {
            spyOn(notify, "showInformation");
            spyOn(store, "remove");

            let storedProfile = new AccountProfile(<AccountProfile>{firstName: "Joe", lastName: "Jones", email: "joe.jones@test.com"});

            store.set("profile", storedProfile);

            await sut.OnLoad();

            expect(notify.showInformation).toHaveBeenCalled();
            expect(store.remove).toHaveBeenCalledWith("profile");
        });  
        it("populates values from authentication when missing", async () => {
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
        });
        it("displays notification when loading profile throws known failure", async () => {
            let expected = new Failure("Uh oh!");

            spyOn(notify, "showFailure");

            profileService.getAccountProfile = () => {
                throw expected;
            };
              
            await sut.OnLoad();

            expect(notify.showFailure).toHaveBeenCalledWith(expected);
        });
        it("throws error when loading profile throws unknown failure", async () => {
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
        });
        it("sets compiledMarkdown to empty when about is null", async () => {
            model.about = null;

            await sut.OnLoad();

            expect(sut.compiledMarkdown).toEqual("");
        });
        it("sets compiledMarkdown to compiled markdown when about has value", async () => {
            model.about = "- stuff";

            await sut.OnLoad();

            let actual = sut.compiledMarkdown.replace(/\r?\n|\r/g, "");

            expect(actual).toEqual("<ul><li>stuff</li></ul>");
        });
        it("loads timezones", async () => {
            await sut.OnLoad();

            expect(sut.timezones).toEqual(timezones);
        });
        it("loads birthYears", async () => {
            await sut.OnLoad();

            expect(sut.birthYears).toEqual(birthYears);
        });
        it("loads techYears", async () => {
            await sut.OnLoad();

            expect(sut.techYears).toEqual(techYears);
        });
        it("loads statuses", async () => {
            await sut.OnLoad();

            expect(sut.statuses).toEqual(statuses);
        });
        it("loads languages", async () => {
            await sut.OnLoad();

            expect(sut.languages.length).toEqual(1);
            expect(sut.languages[0]).toEqual("English");
        });
        it("loads genders", async () => {
            await sut.OnLoad();

            expect(sut.genders.length).toEqual(1);
            expect(sut.genders[0]).toEqual("Female");
        });
        it("marks loading as false", async () => {
            await sut.OnLoad();

            let actual = sut.loading;

            expect(actual).toBeFalsy();
        });
        it("marks disabledButtons as false", async () => {
            await sut.OnLoad();

            let actual = sut.disableButtons;

            expect(actual).toBeFalsy();
        });
        it("marks button loading indicators as false", async () => {
            await sut.OnLoad();

            expect(sut.savingModel).toBeFalsy();
            expect(sut.hidingModel).toBeFalsy();
            expect(sut.exportingModel).toBeFalsy();
            expect(sut.deletingModel).toBeFalsy();
        });
        it("marks expandPrivacy as false when hash is empty", async () => {
            await sut.OnLoad();

            let actual = sut.expandPrivacy;

            expect(actual).toBeFalsy();
        });
        it("marks expandPrivacy as false when hash is unexpected value", async () => {
            hash = "#something";

            await sut.OnLoad();

            let actual = sut.expandPrivacy;

            expect(actual).toBeFalsy();
        });
        it("marks expandPrivacy as true when hash is privacy", async () => {
            hash = "#privacy";
            
            await sut.OnLoad();

            let actual = sut.expandPrivacy;

            expect(actual).toBeTruthy();
        });
        it("marks expandPrivacy as true when hash is privacy ignoring case", async () => {
            hash = "#PRIVACY";
            
            await sut.OnLoad();

            let actual = sut.expandPrivacy;

            expect(actual).toBeTruthy();
        });
    });

    describe("OnSave", () => {
        it("shows notification when validation fails", async () => {
            spyOn(profileService, "updateAccountProfile");
            spyOn(notify, "showWarning");

            isValid = false;

            await sut.OnLoad();
            await sut.OnSave();

            expect(profileService.updateAccountProfile).not.toHaveBeenCalled();
            expect(notify.showWarning).toHaveBeenCalled();
        });
        it("shows notification on successful save", async () => {
            spyOn(store, "set").and.callThrough();
            spyOn(profileService, "updateAccountProfile");
            spyOn(store, "remove").and.callThrough();
            spyOn(notify, "showSuccess");
            
            await sut.OnLoad();
            await sut.OnSave();

            expect(store.set).toHaveBeenCalledWith("profile", model);
            expect(store.set).toHaveBeenCalledWith("storedProfile", model);
            expect(profileService.updateAccountProfile).toHaveBeenCalledWith(model);
            expect(store.remove).toHaveBeenCalledWith("profile");
            expect(store.remove).toHaveBeenCalledWith("storedProfile");
            expect(notify.showSuccess).toHaveBeenCalled();
        });
        it("shows failiure notification on known save failure", async () => {
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
            expect(store.set).toHaveBeenCalledWith("storedProfile", model);
            expect(store.remove).not.toHaveBeenCalled();
            expect(notify.showFailure).toHaveBeenCalled();
        });
        it("shows error notification and throws error on unknown save failure", async () => {
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
            expect(store.remove).not.toHaveBeenCalled();
            expect(notify.showError).toHaveBeenCalled();
        });
        it("sets button state around successful save", async () => {
            profileService.updateAccountProfile = (profile: AccountProfile): Promise<void> => {
                expect(sut.disableButtons).toBeTruthy();
                expect(sut.savingModel).toBeTruthy();
                return Promise.resolve();
            };
            
            await sut.OnLoad();
            await sut.OnSave();
            
            expect(sut.savingModel).toBeFalsy();
            expect(sut.disableButtons).toBeFalsy();
        });
        it("sets button state around failed save", async () => {
            profileService.updateAccountProfile = (profile: AccountProfile): Promise<void> => {
                expect(sut.disableButtons).toBeTruthy();
                expect(sut.savingModel).toBeTruthy();
                return Promise.reject(new Failure("Uh oh!"));
            };
            
            await sut.OnLoad();
            await sut.OnSave();
            
            expect(sut.savingModel).toBeFalsy();
            expect(sut.disableButtons).toBeFalsy();
        });
    });

    describe("OnHide", () => {
        it("shows notification on successful save", async () => {
            spyOn(store, "set").and.callThrough();
            spyOn(profileService, "updateAccountProfile");
            spyOn(store, "remove").and.callThrough();
            spyOn(notify, "showSuccess");
            
            await sut.OnLoad();
            await sut.OnHide();

            model.status = "hidden";

            expect(store.set).toHaveBeenCalledWith("profile", model);
            expect(store.set).toHaveBeenCalledWith("storedProfile", model);
            expect(profileService.updateAccountProfile).toHaveBeenCalledWith(model);
            expect(store.remove).toHaveBeenCalledWith("profile");
            expect(store.remove).toHaveBeenCalledWith("storedProfile");
            expect(notify.showSuccess).toHaveBeenCalled();
        });
        it("updates last loaded model instead of updated model", async () => {
            spyOn(store, "set").and.callThrough();
            spyOn(profileService, "updateAccountProfile");
            spyOn(store, "remove").and.callThrough();
            spyOn(notify, "showSuccess");
            
            await sut.OnLoad();

            let originalFirstName = model.firstName;

            model.firstName = "UpdatedFirstName";

            await sut.OnHide();

            expect((<any>profileService.updateAccountProfile).calls.argsFor(0)[0].firstName).toEqual(originalFirstName);
            expect(model.firstName).toEqual("UpdatedFirstName");
        });
        it("shows failiure notification on known save failure", async () => {
            spyOn(store, "set").and.callThrough();
            spyOn(store, "remove").and.callThrough();
            spyOn(notify, "showFailure");

            let failure = new Failure("Uh oh!");

            profileService.updateAccountProfile = (profile: AccountProfile): Promise<void> => {
                return Promise.reject(failure);
            };
            
            await sut.OnLoad();
            await sut.OnHide();

            model.status = "hidden";

            expect(store.set).toHaveBeenCalledWith("profile", model);
            expect(store.set).toHaveBeenCalledWith("storedProfile", model);
            expect(store.remove).not.toHaveBeenCalled();
            expect(notify.showFailure).toHaveBeenCalled();
        });
        it("shows error notification and throws error on unknown save failure", async () => {
            spyOn(store, "set").and.callThrough();
            spyOn(store, "remove").and.callThrough();
            spyOn(notify, "showError");

            let failure = new Error("Uh oh!");

            profileService.updateAccountProfile = (profile: AccountProfile): Promise<void> => {
                return Promise.reject(failure);
            };
            
            await sut.OnLoad();

            try {
                await sut.OnHide();

                throw new Error("Test should have thrown an error");
            }
            catch (e) {
                expect(e).toEqual(failure);
            }

            model.status = "hidden";

            expect(store.set).toHaveBeenCalledWith("profile", model);
            expect(store.set).toHaveBeenCalledWith("storedProfile", model);
            expect(store.remove).not.toHaveBeenCalled();
            expect(notify.showError).toHaveBeenCalled();
        });
        it("sets button state around successful save", async () => {
            profileService.updateAccountProfile = (profile: AccountProfile): Promise<void> => {
                expect(sut.disableButtons).toBeTruthy();
                expect(sut.hidingModel).toBeTruthy();
                return Promise.resolve();
            };
            
            await sut.OnLoad();
            await sut.OnHide();
            
            expect(sut.hidingModel).toBeFalsy();
            expect(sut.disableButtons).toBeFalsy();
        });
        it("sets button state around failed save", async () => {
            profileService.updateAccountProfile = (profile: AccountProfile): Promise<void> => {
                expect(sut.disableButtons).toBeTruthy();
                expect(sut.hidingModel).toBeTruthy();
                return Promise.reject(new Failure("Uh oh!"));
            };
            
            await sut.OnLoad();
            await sut.OnHide();
            
            expect(sut.hidingModel).toBeFalsy();
            expect(sut.disableButtons).toBeFalsy();
        });
    });

    describe("OnDelete", () => {
        it("removes profile from service", async () => {
            spyOn(profileService, "deleteAccountProfile");
            spyOn(sut, "signOut");

            await sut.OnDelete();

            expect(profileService.deleteAccountProfile).toHaveBeenCalled();
            expect(sut.signOut).toHaveBeenCalled();
        });
        it("sets button state around successful delete", async () => {
            profileService.deleteAccountProfile = (): Promise<void> => {
                expect(sut.disableButtons).toBeTruthy();
                expect(sut.deletingModel).toBeTruthy();
                return Promise.resolve();
            };
            spyOn(sut, "signOut");
            
            await sut.OnDelete();
            
            expect(sut.deletingModel).toBeTruthy();
            expect(sut.disableButtons).toBeTruthy();
        });
        it("shows failiure notification on known delete failure", async () => {
            profileService.deleteAccountProfile = (): Promise<void> => {
                expect(sut.disableButtons).toBeTruthy();
                expect(sut.deletingModel).toBeTruthy();
                return Promise.reject(new Failure("Uh oh!"));
            };
            spyOn(sut, "signOut");
            spyOn(notify, "showFailure");
            
            await sut.OnDelete();
            
            expect(sut.signOut).not.toHaveBeenCalled();
            expect(sut.deletingModel).toBeFalsy();
            expect(sut.disableButtons).toBeFalsy();
            expect(notify.showFailure).toHaveBeenCalled();
        });
        it("shows failiure notification on unknown delete failure", async () => {
            let failure = new Error("Uh oh!");
            profileService.deleteAccountProfile = (): Promise<void> => {
                expect(sut.disableButtons).toBeTruthy();
                expect(sut.deletingModel).toBeTruthy();
                return Promise.reject(failure);
            };
            spyOn(sut, "signOut");
            spyOn(notify, "showError");
                        
            try {            
                await sut.OnDelete();
    
                throw new Error("Test should have thrown an error");
            }
            catch (e) {
                expect(e).toEqual(failure);
            }

            expect(sut.signOut).not.toHaveBeenCalled();
            expect(sut.deletingModel).toBeFalsy();
            expect(sut.disableButtons).toBeFalsy();
            expect(notify.showError).toHaveBeenCalled();
        });
    });

    describe("OnExport", () => {
        it("exports current profile", async () => {
            spyOn(jsonDownloader, "download");
            
            await sut.OnExport();

            expect(<any>jsonDownloader.download).toHaveBeenCalledWith(exportModel.id + ".json", exportModel);
        });
        it("shows failiure notification on known export failure", async () => {
            spyOn(notify, "showFailure");

            let failure = new Failure("Uh oh!");

            profileService.exportAccountProfile = (): Promise<ExportProfile> => {
                return Promise.reject(failure);
            };
            
            await sut.OnExport();

            expect(notify.showFailure).toHaveBeenCalled();
        });
        it("shows error notification and throws error on unknown save failure", async () => {
            spyOn(notify, "showError");

            let failure = new Error("Uh oh!");

            profileService.exportAccountProfile = (): Promise<ExportProfile> => {
                return Promise.reject(failure);
            };

            try {            
                await sut.OnExport();
    
                throw new Error("Test should have thrown an error");
            }
            catch (e) {
                expect(e).toEqual(failure);
            }

            expect(notify.showError).toHaveBeenCalled();
        });
        it("sets button state around successful save", async () => {
            profileService.exportAccountProfile = (): Promise<ExportProfile> => {
                expect(sut.disableButtons).toBeTruthy();
                expect(sut.exportingModel).toBeTruthy();
                return Promise.resolve(exportModel);
            };
            
            await sut.OnExport();
            
            expect(sut.exportingModel).toBeFalsy();
            expect(sut.disableButtons).toBeFalsy();
        });
        it("sets button state around failed save", async () => {
            profileService.exportAccountProfile = (): Promise<ExportProfile> => {
                expect(sut.disableButtons).toBeTruthy();
                expect(sut.exportingModel).toBeTruthy();
                return Promise.reject(new Failure("Uh oh!"));
            };
            
            await sut.OnExport();
            
            expect(sut.exportingModel).toBeFalsy();
            expect(sut.disableButtons).toBeFalsy();
        });
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
        it("updates languages to title case", async () => {
            model.languages.push("spanish");

            await sut.OnLoad();
            sut.CheckLanguages(model.languages);

            expect(sut.model.languages.length).toEqual(2);
            expect(sut.model.languages[1]).toEqual("Spanish");
        });
    });

    describe("CompileMarkdown", () => {
        it("sets compiledMarkdown to empty when about is null", async () => {
            model.about = null;

            await sut.OnLoad();
            sut.CompileMarkdown();

            expect(sut.compiledMarkdown).toEqual("");
        });
        it("sets compiledMarkdown to compiled markdown when about has value", async () => {
            model.about = "- stuff";

            await sut.OnLoad();
            sut.CompileMarkdown();

            let actual = sut.compiledMarkdown.replace(/\r?\n|\r/g, "");

            expect(actual).toEqual("<ul><li>stuff</li></ul>");
        });
    });
});