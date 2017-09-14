import { AdminCategoriesService, AdminCategory, AdminCategoryGroup } from "./adminCategoriesService";
import { IHttp } from "../http";

const core = require("../../tests/core");

describe("adminCategoriesService.ts", () => {
    let adminCategories: Array<AdminCategory>;
    let http: IHttp;
    let sut: AdminCategoriesService;

    beforeEach(function () {
        adminCategories = new Array<AdminCategory>();
        
        adminCategories.push(
            <AdminCategory>{
                group: AdminCategoryGroup.Language,
                name: "English",
                linkCount: 123,
                reviewed: true,
                visible: true
            });
        adminCategories.push(
            <AdminCategory>{
                group: AdminCategoryGroup.Gender,
                name: "Female",
                linkCount: 543,
                reviewed: true,
                visible: true
            });
        adminCategories.push(
            <AdminCategory>{
                group: AdminCategoryGroup.Language,
                name: "I Rock",
                linkCount: 0,
                reviewed: true,
                visible: false
            });
            

        http = <IHttp>{
            get: async (resource: string): Promise<Array<AdminCategory>> => {
                return adminCategories;
            },
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
});