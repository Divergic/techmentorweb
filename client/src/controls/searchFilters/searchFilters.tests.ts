import SearchFilters from "./searchFilters";
import { ICategoriesService, Category, CategoryGroup } from "../../services/api/categoriesService";

const core = require("../../tests/core");

describe("SearchFilters", () => {
    let sut: SearchFilters;
    let service: ICategoriesService;
    let categories: Array<Category>;

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
        service = <ICategoriesService>{
            getCategories: (): Promise<Array<Category>> => {
                return Promise.resolve(categories);
            }
        };

        sut = new SearchFilters();

        sut.configure(service);

        (<any>sut).$router = {
            currentRoute: {
                query: {                    
                }
            },
            push: (options: any): void => {                
            }
        };
        (<any>sut).$emit = (genders: Array<string>, languages: Array<string>, skills: Array<string>) => {
        };

        SearchFilters.Clear();
    });

    describe("OnLoad", () => {
        it("loads categories and matches filters", core.runAsync(async () => {
            spyOn(sut, "LoadCategories");
            spyOn(sut, "MatchFilters");
            spyOn(sut, "RunSearch");

            await sut.OnLoad();

            expect(sut.LoadCategories).toHaveBeenCalled();
            expect(sut.MatchFilters).toHaveBeenCalled();
            expect(sut.RunSearch).toHaveBeenCalled();
        }));
    });

    describe("OnRouteChanged", () => {
        it("loads categories and matches filters", core.runAsync(async () => {
            spyOn(sut, "LoadCategories");
            spyOn(sut, "MatchFilters");
            spyOn(sut, "RunSearch");

            await sut.OnRouteChanged();

            expect(sut.LoadCategories).not.toHaveBeenCalled();
            expect(sut.MatchFilters).toHaveBeenCalled();
            expect(sut.RunSearch).toHaveBeenCalled();
        }));
    });

    describe("LoadCategories", () => {
        it("loads languages", core.runAsync(async () => {
            await sut.LoadCategories();

            expect(sut.languages.length).toEqual(1);
            expect(sut.languages[0]).toEqual(categories[1]);
        }));
        it("ignores languages with 0 linkCount", core.runAsync(async () => {
            categories.push(<Category>{
                group: "language",
                name: "Spanish",
                linkCount: 0
            });

            await sut.LoadCategories();

            expect(sut.languages.length).toEqual(1);
            expect(sut.languages[0]).toEqual(categories[1]);
        }));
        it("loads genders", core.runAsync(async () => {
            await sut.LoadCategories();

            expect(sut.genders.length).toEqual(1);
            expect(sut.genders[0]).toEqual(categories[2]);
        }));
        it("ignores genders with 0 linkCount", core.runAsync(async () => {
            categories.push(<Category>{
                group: "gender",
                name: "Male",
                linkCount: 0
            });
            
            await sut.LoadCategories();

            expect(sut.languages.length).toEqual(1);
            expect(sut.languages[0]).toEqual(categories[1]);
        }));
        it("loads skills", core.runAsync(async () => {
            await sut.LoadCategories();

            expect(sut.skills.length).toEqual(2);
            expect(sut.skills[0]).toEqual(categories[0]);
            expect(sut.skills[1]).toEqual(categories[3]);
        }));
        it("sets loadingLists to false", core.runAsync(async () => {
            await sut.LoadCategories();

            expect(sut.loadingLists).toBeFalsy();
        }));
        it("ignores skills with 0 linkCount", core.runAsync(async () => {
            categories.push(<Category>{
                group: "skill",
                name: "WPFz",
                linkCount: 0
            });
            
            await sut.LoadCategories();

            expect(sut.languages.length).toEqual(1);
            expect(sut.languages[0]).toEqual(categories[1]);
        }));
        it("sets loadingLists to false", core.runAsync(async () => {
            expect(sut.loadingLists).toBeTruthy();
            
            await sut.LoadCategories();

            expect(sut.loadingLists).toBeFalsy();
        }));
        it("returns cached categories from the same instance", core.runAsync(async () => {
            spyOn(service, "getCategories").and.callThrough();

            await sut.LoadCategories();
            await sut.LoadCategories();
            
            expect(service.getCategories).toHaveBeenCalledTimes(1);
        }));
    });

    describe("MatchFilters", () => {
        it("set selectedLanguages to empty when no filter parameter provided", core.runAsync(async () => {
            sut.$router.currentRoute.query = {};

            await sut.LoadCategories();
            await sut.MatchFilters();

            expect(sut.selectedLanguages.length).toEqual(0);
        }));
        it("set selectedLanguages to single filter parameter", core.runAsync(async () => {
            sut.$router.currentRoute.query = {
                language: "English"
            };

            await sut.LoadCategories();
            await sut.MatchFilters();

            expect(sut.selectedLanguages.length).toEqual(1);
            expect(sut.selectedLanguages[0]).toEqual("English");
        }));
        it("set selectedLanguages to multiple filter parameters", core.runAsync(async () => {
            categories.push(
                <Category>{
                    group: CategoryGroup.Language,
                    name: "Spanish",
                    linkCount: 455
                });
            sut.$router.currentRoute.query = {
                language: <any>["English", "Spanish"]
            };

            await sut.LoadCategories();
            await sut.MatchFilters();

            expect(sut.selectedLanguages.length).toEqual(2);
            expect(sut.selectedLanguages[0]).toEqual("English");
            expect(sut.selectedLanguages[1]).toEqual("Spanish");
        }));
        it("matches case insensitive language", core.runAsync(async () => {
            categories.push(
                <Category>{
                    group: CategoryGroup.Language,
                    name: "Spanish",
                    linkCount: 455
                });
            sut.$router.currentRoute.query = {
                language: <any>["english", "spanish"]
            };

            await sut.LoadCategories();
            await sut.MatchFilters();

            expect(sut.selectedLanguages.length).toEqual(2);
            expect(sut.selectedLanguages[0]).toEqual("English");
            expect(sut.selectedLanguages[1]).toEqual("Spanish");
        }));
        it("ignores language filter that does not match category", core.runAsync(async () => {
            sut.$router.currentRoute.query = {
                language: <any>["English", "Spanish"]
            };

            await sut.LoadCategories();
            await sut.MatchFilters();

            expect(sut.selectedLanguages.length).toEqual(1);
            expect(sut.selectedLanguages[0]).toEqual("English");
        }));
        it("set selectedSkills to empty when no filter parameter provided", core.runAsync(async () => {
            sut.$router.currentRoute.query = {};

            await sut.LoadCategories();
            await sut.MatchFilters();

            expect(sut.selectedSkills.length).toEqual(0);
        }));
        it("set selectedSkills to single filter parameter", core.runAsync(async () => {
            sut.$router.currentRoute.query = {
                skill: "C#"
            };

            await sut.LoadCategories();
            await sut.MatchFilters();

            expect(sut.selectedSkills.length).toEqual(1);
            expect(sut.selectedSkills[0]).toEqual("C#");
        }));
        it("set selectedSkills to multiple filter parameters", core.runAsync(async () => {
            sut.$router.currentRoute.query = {
                skill: <any>["C#", "C++"]
            };

            await sut.LoadCategories();
            await sut.MatchFilters();

            expect(sut.selectedSkills.length).toEqual(2);
            expect(sut.selectedSkills[0]).toEqual("C#");
            expect(sut.selectedSkills[1]).toEqual("C++");
        }));
        it("matches case insensitive skill", core.runAsync(async () => {
            sut.$router.currentRoute.query = {
                skill: <any>["c#", "c++"]
            };

            await sut.LoadCategories();
            await sut.MatchFilters();

            expect(sut.selectedSkills.length).toEqual(2);
            expect(sut.selectedSkills[0]).toEqual("C#");
            expect(sut.selectedSkills[1]).toEqual("C++");
        }));
        it("ignores skill filter that does not match category", core.runAsync(async () => {
            sut.$router.currentRoute.query = {
                skill: <any>["C#", "Azure"]
            };

            await sut.LoadCategories();
            await sut.MatchFilters();

            expect(sut.selectedSkills.length).toEqual(1);
            expect(sut.selectedSkills[0]).toEqual("C#");
        }));        
        it("set selectedGender to null when no filter parameter provided", core.runAsync(async () => {
            sut.$router.currentRoute.query = {};

            await sut.LoadCategories();
            await sut.MatchFilters();

            expect(sut.selectedGender).toBeNull();
        }));
        it("set selectedGender to single filter parameter", core.runAsync(async () => {
            sut.$router.currentRoute.query = {
                gender: "Female"
            };

            await sut.LoadCategories();
            await sut.MatchFilters();

            expect(sut.selectedGender).toEqual("Female");
        }));
        it("set selectedGender to first filter parameters", core.runAsync(async () => {
            categories.push(
                <Category>{
                    group: CategoryGroup.Gender,
                    name: "Male",
                    linkCount: 455
                });
            sut.$router.currentRoute.query = {
                gender: <any>["Female", "Male"]
            };

            await sut.LoadCategories();
            await sut.MatchFilters();

            expect(sut.selectedGender).toEqual("Female");
        }));
        it("matches case insensitive gender", core.runAsync(async () => {
            categories.push(
                <Category>{
                    group: CategoryGroup.Gender,
                    name: "Male",
                    linkCount: 455
                });
            sut.$router.currentRoute.query = {
                gender: "male"
            };

            await sut.LoadCategories();
            await sut.MatchFilters();

            expect(sut.selectedGender).toEqual("Male");
        }));
        it("ignores gender filter that does not match category", core.runAsync(async () => {
            sut.$router.currentRoute.query = {
                gender: "Non-binary"
            };

            await sut.LoadCategories();
            await sut.MatchFilters();

            expect(sut.selectedGender).toBeNull();
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
            sut.selectedGender = "Female";

            let actual = sut.FiltersSelected;

            expect(actual).toBeTruthy();
        });
        it("return true when language filter selected", () => {
            sut.selectedLanguages.push("English");

            let actual = sut.FiltersSelected;

            expect(actual).toBeTruthy();
        });
    });

    describe("OnSearchClick", () => {
        it("redirects to search with specified values", () => {
            sut.selectedGender = "Female";
            sut.selectedLanguages = new Array<string>("English");
            sut.selectedSkills = new Array<string>("C#");
            
            let spy = spyOn(sut.$router, "push");
            
            sut.OnSearchClick();
            
            expect(spy.calls.argsFor(0)[0].name).toEqual("search");
            expect(spy.calls.argsFor(0)[0].query.gender).toEqual("Female");
            expect(spy.calls.argsFor(0)[0].query.language.length).toEqual(1);
            expect(spy.calls.argsFor(0)[0].query.language[0]).toEqual("English");
            expect(spy.calls.argsFor(0)[0].query.skill.length).toEqual(1);
            expect(spy.calls.argsFor(0)[0].query.skill[0]).toEqual("C#");
        });
    });
    
    describe("RunSearch", () => {
        it("does not emit runSearch event when no categories selected", () => {            
            sut.selectedGender = null;
            sut.selectedLanguages = new Array<string>();
            sut.selectedSkills = new Array<string>();

            spyOn(sut, "$emit");

            sut.RunSearch();
            
            expect(sut.$emit).not.toHaveBeenCalled();
        });
        it("emits runSearch event with selected values", () => {            
            sut.selectedGender = "Female";
            sut.selectedLanguages = new Array<string>("English");
            sut.selectedSkills = new Array<string>("C#");

            let spy = spyOn(sut, "$emit");

            sut.RunSearch();
            
            expect(spy.calls.argsFor(0)[0]).toEqual("runSearch");
            expect(spy.calls.argsFor(0)[1]).toEqual("Female");
            expect(spy.calls.argsFor(0)[2].length).toEqual(1);
            expect(spy.calls.argsFor(0)[2][0]).toEqual("English");
            expect(spy.calls.argsFor(0)[3].length).toEqual(1);
            expect(spy.calls.argsFor(0)[3][0]).toEqual("C#");
        });
    });
});