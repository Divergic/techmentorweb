import { AdminCategoriesService, AdminCategory, AdminUpdateCategory } from "./adminCategoriesService";
import { IHttp } from "../http";

const core = require("../../tests/core");

describe("AdminUpdateCategory", () => {
    describe("constructor", () => {
        it("can create without a value", () => {
            let sut = new AdminUpdateCategory();

            expect(sut.group).toBeUndefined();
            expect(sut.name).toBeUndefined();
            expect(sut.visible).toBeFalsy();
        });
        it("can create with copy value", () => {
            let source = <AdminCategory>{
                group: "language",
                name: "English",
                linkCount: 123,
                reviewed: true,
                visible: true
            };

            let sut = new AdminUpdateCategory(source);

            expect(sut.group).toEqual(source.group);
            expect(sut.name).toEqual(source.name);
            expect(sut.visible).toEqual(source.visible);
        })
    })
});

describe("AdminCategoriesService", () => {
    let adminCategories: Array<AdminCategory>;
    let http: IHttp;
    let sut: AdminCategoriesService;

    beforeEach(function () {
        adminCategories = new Array<AdminCategory>();
        
        adminCategories.push(
            <AdminCategory>{
                group: "language",
                name: "English",
                linkCount: 123,
                reviewed: true,
                visible: true
            });
        adminCategories.push(
            <AdminCategory>{
                group: "gender",
                name: "Female",
                linkCount: 543,
                reviewed: true,
                visible: true
            });
        adminCategories.push(
            <AdminCategory>{
                group: "language",
                name: "I Rock",
                linkCount: 0,
                reviewed: true,
                visible: false
            });
            

        http = <IHttp>{
            get: async (resource: string): Promise<Array<AdminCategory>> => {
                return adminCategories;
            },
            put: async (resource: string, data: any): Promise<void> => {                
            }
        };

        sut = new AdminCategoriesService(http);          
    });

    describe("getCategories", () => {
        it("returns admin categories from API", core.runAsync(async () => {
            spyOn(http, "get").and.callThrough();

            let actual = await sut.getCategories();

            expect(http.get).toHaveBeenCalledWith("categories/");
            expect(actual).toEqual(adminCategories);
        }));
    });

    describe("updateCategory", () => {
        it("sends category update to API", core.runAsync(async () => {
            let category = new AdminUpdateCategory();

            category.group = "Skill";
            category.name = "somename"
            category.visible = true;

            let spy = spyOn(http, "put");

            await sut.updateCategory(category);

            expect(http.put).toHaveBeenCalled();
            expect(spy.calls.mostRecent().args[0]).toEqual("categories/Skill/somename");
            expect(spy.calls.mostRecent().args[1].visible).toBeTruthy();
        }));
        it("correctly encodes spaces in name for resource on API", core.runAsync(async () => {
            let category = new AdminUpdateCategory();

            category.group = "Skill";
            category.name = "some name"
            category.visible = true;

            let spy = spyOn(http, "put");

            await sut.updateCategory(category);

            expect(http.put).toHaveBeenCalled();
            expect(spy.calls.mostRecent().args[0]).toEqual("categories/Skill/some%20name");
            expect(spy.calls.mostRecent().args[1].visible).toBeTruthy();
        }));
    });
});