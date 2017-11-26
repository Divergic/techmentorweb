import SkillDialog from "./skillDialog";
import { Skill } from "../../services/api/skill";
import { INotify } from "../../services/notify";
import { IListsService, ListItem } from "../../services/lists";
import { ICategoriesService, Category, CategoryGroup } from "../../services/api/categoriesService";

const core = require("../../tests/core");

describe("SkillDialog", () => {
    let listsService: IListsService;
    let categoriesService: ICategoriesService;
    let notify: INotify;
    let skillLevels: Array<ListItem<string>>;
    let techYears: Array<number>;
    let categories: Array<Category>;
    let model: Skill;
    let sut: SkillDialog;
    let isValid: boolean;

    beforeEach(core.runAsync(async () => {            
        skillLevels = <Array<ListItem<string>>>[
            <ListItem<string>> {
                name: "Beginner",
                value: "beginner"
            },
            <ListItem<string>> {
                name: "Expert",
                value: "expert"
            },
            <ListItem<string>> {
                name: "Neo",
                value: "neo"
            }];
        techYears = <Array<number>>[2010, 2009, 2008, 2007, 2006, 2005, 2004];
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
        listsService = <IListsService>{
            getTechYears: () => {
                return techYears;
            },
            getSkillLevels: () => {
                return skillLevels;
            },
            getBirthYears: () => {
                return <Array<number>><any>null;
            },
            getProfileStatuses: () => {
                return <Array<ListItem<string>>><any>null;
            },
            getTimezones: () => {
                return <Array<string>><any>null;
            }
        };
        categoriesService = <ICategoriesService>{
            getCategories: async () => {
                return categories;
            }
        };
        notify = <INotify>{
            showWarning: (message) => {

            }
        };
        model = new Skill();
        isValid = true;

        sut = new SkillDialog();

        sut.configure(listsService, categoriesService, notify);
        sut.model = model;

        await sut.OnLoad();

        // Hook vuejs component function
        (<any>sut).$emit = (name: string) => {
        };
        (<any>sut).$nextTick = (func: Function) => {
            func.call(sut);
        };
        (<any>sut).$validator = {
            errors: {
                clear: (name) => {

                }
            },
            validateAll: async (name: string) => {
                return isValid;
            }
        };
    }));

    describe("OnLoad", () => {
        // NOTE: OnLoad is invoked in beforeEach to make the remaining test scenarios cleaner
        it("loads tech years from services", () => {
            let actual = sut.techYears;

            expect(actual).toEqual(techYears);
        });
        it("loads skill levels from services", () => {
            let actual = sut.skillLevels;

            expect(actual).toEqual(skillLevels);
        });
        it("loads skill categories from services", () => {
            let actual = sut.skills;

            expect(actual.length).toEqual(2);
            expect(actual[0]).toEqual("C#");
            expect(actual[1]).toEqual("C++");
        });
    });

    describe("SkillsChanged", () => {
        it("returns all skills when no skills are used", () => {
            sut.usedSkills = new Array<Skill>();

            sut.SkillsChanged();

            let actual = sut.availableSkills;

            expect(actual).toEqual(sut.skills);
        });
        it("returns unused skills when skills are used", () => {
            sut.usedSkills = <Array<Skill>>[
                <Skill>{
                    name: "C#"
                }
            ];

            sut.SkillsChanged();
            
            let actual = sut.availableSkills;

            expect(actual.length).toEqual(1);
            expect(actual[0]).toEqual("C++");
        });
        it("returns unused skills when skills are used with case insensitive comparison", () => {
            sut.usedSkills = <Array<Skill>>[
                <Skill>{
                    name: "c#"
                }
            ];

            sut.SkillsChanged();
            
            let actual = sut.availableSkills;

            expect(actual.length).toEqual(1);
            expect(actual[0]).toEqual("C++");
        });
    });

    describe("YearStartedChanged", () => {
        it("sets techYearsLastUsed to full tech year list when yearStarted is null", () => {
            sut.YearStartedChanged();

            let actual = sut.techYearsLastUsed;

            expect(actual).toEqual(techYears);
        });
        it("sets techYearsLastUsed to tech year list starting from yearStarted", () => {
            let expected = new Array<number>(2010, 2009, 2008, 2007);

            sut.model.yearStarted = 2007;

            sut.YearStartedChanged();

            let actual = sut.techYearsLastUsed;

            expect(actual).toEqual(expected);
        });
    });

    describe("YearLastUsedChanged", () => {
        it("sets techYearsStarted to full tech year list when yearLastUsed is null", () => {
            sut.YearLastUsedChanged();

            let actual = sut.techYearsStarted;

            expect(actual).toEqual(techYears);
        });
        it("sets techYearsStarted to tech year list starting from yearStarted", () => {
            let expected = new Array<number>(2007, 2006, 2005, 2004);

            sut.model.yearLastUsed = 2007;

            sut.YearLastUsedChanged();

            let actual = sut.techYearsStarted;

            expect(actual).toEqual(expected);
        });
    });

    describe("OnClose", () => {
        it("emits closeSkill event", () => {
            let spy = spyOn(sut, "$emit");

            sut.OnClose();
            
            expect(spy.calls.argsFor(0)[0]).toEqual("closeSkill");
        });
        it("resets form validate", () => {
            let spy = spyOn((<any>sut).$validator.errors, "clear");
            
            sut.OnClose();
            
            expect(spy.calls.argsFor(0)[0]).toEqual("skillForm");
        });
    });

    describe("OnSave", () => {
        it("emits saveSkill event when form is valid", core.runAsync(async () => {    
            let spy = spyOn(sut, "$emit");

            await sut.OnSave();
            
            expect(spy.calls.argsFor(0)[0]).toEqual("saveSkill");
        }));
        it("does not emit saveSkill event when form is invalid", core.runAsync(async () => {    
            isValid = false;

            spyOn(sut, "$emit");

            await sut.OnSave();
            
            expect((<any>sut).$emit).not.toHaveBeenCalled();
        }));
        it("resets form validation when form is valid", core.runAsync(async () => {    
            let spy = spyOn((<any>sut).$validator.errors, "clear");
            
            await sut.OnSave();
            
            expect(spy.calls.argsFor(0)[0]).toEqual("skillForm");
        }));
        it("does not reset form validate when form is invalid", core.runAsync(async () => {    
            isValid = false;

            spyOn((<any>sut).$validator.errors, "clear");

            await sut.OnSave();
            
            expect((<any>sut).$validator.errors.clear).not.toHaveBeenCalled();
        }));
        it("notifies with warning when form is invalid", core.runAsync(async () => {    
            isValid = false;

            spyOn(notify, "showWarning");

            await sut.OnSave();
            
            expect(notify.showWarning).toHaveBeenCalled();
        }));
    });
});