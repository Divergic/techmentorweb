import { Category, CategoriesService } from "./categoriesService";
import { IHttp } from "../http";

describe("Category", () => {
    describe("constructor", () => {
        it("copies values from source", () => {
            let source = <Category>{
                group: "gender",
                linkCount: 123,
                name: "Female"
            };

            let sut = new Category(source);

            expect(sut.group).toEqual(source.group);
            expect(sut.linkCount).toEqual(source.linkCount);
            expect(sut.name).toEqual(source.name);
        });
        it("sets default values when source is not provided", () => {
            let sut = new Category();

            expect(sut.group).toEqual("");
            expect(sut.linkCount).toEqual(0);
            expect(sut.name).toEqual("");
        });
        it("sets default values when source is null", () => {
            let sut = new Category(null);

            expect(sut.group).toEqual("");
            expect(sut.linkCount).toEqual(0);
            expect(sut.name).toEqual("");
        });
        it("sets default values when source is undefined", () => {
            let sut = new Category(undefined);

            expect(sut.group).toEqual("");
            expect(sut.linkCount).toEqual(0);
            expect(sut.name).toEqual("");
        });
    });

    describe("displayName", () => {
        it("returns name and link count", () => {
            let source = <Category>{
                group: "gender",
                linkCount: 123,
                name: "Female"
            };
    
            let sut = new Category(source);
    
            expect(sut.displayName).toEqual(source.name + " (" + source.linkCount + ")");
        });
    });
});

describe("CategoriesService", () => {
    let categories: Array<Category>;
    let http: IHttp;
    let sut: CategoriesService;

    beforeEach(() => {
        categories = new Array<Category>();

        categories.push(<Category>{group: "skill", linkCount: 123, name: "Azure"});
        categories.push(<Category>{group: "skill", linkCount: 123, name: "abc"});
        categories.push(<Category>{group: "skill", linkCount: 123, name: "AZY"});
        categories.push(<Category>{group: "gender", linkCount: 123, name: "male"});
        categories.push(<Category>{group: "gender", linkCount: 123, name: "female"});

        http = <IHttp>{
            get: async (resource: string): Promise<Array<Category>> => {
                return categories;
            }
        };

        sut = new CategoriesService(http);
    });

    describe("getCategories", () => {
        it("returns categories from API", async () => {
            spyOn(http, "get").and.callThrough();

            let actual = await sut.getCategories();

            expect(http.get).toHaveBeenCalledWith("categories/");
            expect(actual.length).toEqual(categories.length);
        });
        it("returns sorted categories", async () => {
            spyOn(http, "get").and.callThrough();

            let actual = await sut.getCategories();

            expect(actual[0].group).toEqual("gender");
            expect(actual[0].name).toEqual("female");
            expect(actual[1].group).toEqual("gender");
            expect(actual[1].name).toEqual("male");
            expect(actual[2].group).toEqual("skill");
            expect(actual[2].name).toEqual("abc");
            expect(actual[3].group).toEqual("skill");
            expect(actual[3].name).toEqual("Azure");
            expect(actual[4].group).toEqual("skill");
            expect(actual[4].name).toEqual("AZY");
        });
        it("returns category instances", async () => {
            spyOn(http, "get").and.callThrough();

            let actual = await sut.getCategories();

            let category = actual[0];

            // Display name is a function on the class instance rather than an object cast as the class
            // This proves that the class constructor is used to ensure the correct class instance is involved
            expect(category.displayName).toEqual(category.name + " (" + category.linkCount + ")");
        });
    });
});