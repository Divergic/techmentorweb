import Categories from "./categories";
import { IAdminCategoriesService, AdminCategory, AdminUpdateCategory } from "../../services/api/adminCategoriesService";

const core = require("../../tests/core");

describe("Categories", () => {
    let categories: Array<AdminCategory>;
    let service: IAdminCategoriesService;    
    let sut: Categories;

    beforeEach(() => {
        // Cancel out the console calls to avoid noisy logging in tests
        spyOn(console, "info");

        categories = new Array<AdminCategory>(
            <AdminCategory>{
                group: "skill",
                name: "C#"
            },            
            <AdminCategory>{
                group: "Skill",
                name: "C++"
            },            
            <AdminCategory>{
                group: "language",
                name: "English"
            },
            <AdminCategory>{
                group: "Language",
                name: "Spanish"
            },            
            <AdminCategory>{
                group: "gender",
                name: "Male"
            },            
            <AdminCategory>{
                group: "Gender",
                name: "female"
            }
        );
        service = <IAdminCategoriesService>{
            getCategories: (): Promise<Array<AdminCategory>> => {
                return Promise.resolve(categories);                
            },
            updateCategory: (model: AdminUpdateCategory): Promise<void> => {                
                return Promise.resolve();
            }
        };
        sut = new Categories();

        sut.configure(service);
    });

    describe("OnLoad", () => {
        it("loads categories", core.runAsync(async () => {
            await sut.OnLoad();

            let actual = sut.categorySets;

            expect(actual.length).toEqual(3);
            expect(actual[0].categories.length).toEqual(2);
            expect(actual[0].groupName).toEqual("Skills");
            expect(actual[1].categories.length).toEqual(2);
            expect(actual[1].groupName).toEqual("Languages");
            expect(actual[2].categories.length).toEqual(2);
            expect(actual[2].groupName).toEqual("Genders");
        }));
        it("returns empty category sets when no data returned", core.runAsync(async () => {
            categories = new Array<AdminCategory>();

            await sut.OnLoad();

            let actual = sut.categorySets;

            expect(actual.length).toEqual(3);
            expect(actual[0].categories.length).toEqual(0);
            expect(actual[0].groupName).toEqual("Skills");
            expect(actual[1].categories.length).toEqual(0);
            expect(actual[1].groupName).toEqual("Languages");
            expect(actual[2].categories.length).toEqual(0);
            expect(actual[2].groupName).toEqual("Genders");
        }));
    });

    describe("EnsureReviewed", () => {
        it("does not update category when already reviewed", core.runAsync(async () => {
            spyOn(service, "updateCategory");

            let category = <AdminCategory>{
                group: "skill",
                name: "C#",
                reviewed: true
            };

            await sut.EnsureReviewed(category);

            expect(service.updateCategory).not.toHaveBeenCalled();
        }));
        it("updates category when not already reviewed", core.runAsync(async () => {
            let spy = spyOn(service, "updateCategory");

            let category = <AdminCategory>{
                group: "skill",
                name: "C#",
                reviewed: false,
                visible: true
            };

            await sut.EnsureReviewed(category);

            expect(service.updateCategory).toHaveBeenCalled();
            expect(spy.calls.mostRecent().args[0].group).toEqual(category.group);
            expect(spy.calls.mostRecent().args[0].name).toEqual(category.name);
            expect(spy.calls.mostRecent().args[0].visible).toEqual(category.visible);
        }));
    });

    describe("UpdateCategory", () => {
        it("updates category", core.runAsync(async () => {
            let spy = spyOn(service, "updateCategory");

            let category = <AdminCategory>{
                group: "skill",
                name: "C#",
                visible: true
            };

            await sut.UpdateCategory(category);

            expect(service.updateCategory).toHaveBeenCalled();
            expect(spy.calls.mostRecent().args[0].group).toEqual(category.group);
            expect(spy.calls.mostRecent().args[0].name).toEqual(category.name);
            expect(spy.calls.mostRecent().args[0].visible).toEqual(category.visible);
        }));
    });
});