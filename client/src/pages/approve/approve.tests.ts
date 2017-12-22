import Approve from "./approve";
import { IAdminCategoriesService, AdminCategory, AdminUpdateCategory } from "../../services/api/adminCategoriesService";

const core = require("../../tests/core");

describe("Approve", () => {
    let categories: Array<AdminCategory>;
    let service: IAdminCategoriesService;    
    let sut: Approve;

    beforeEach(() => {
        // Cancel out the console calls to avoid noisy logging in tests
        spyOn(console, "info");

        categories = new Array<AdminCategory>(
            <AdminCategory>{
                group: "Skill",
                name: "C#"
            },            
            <AdminCategory>{
                group: "Skill",
                name: "C++"
            },            
            <AdminCategory>{
                group: "Language",
                name: "English"
            },
            <AdminCategory>{
                group: "Language",
                name: "Spanish"
            },            
            <AdminCategory>{
                group: "Gender",
                name: "Male"
            },            
            <AdminCategory>{
                group: "Gender",
                name: "Female"
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
        sut = new Approve();

        sut.configure(service);
        
        (<any>sut).$router = {
            currentRoute: {
                query: {
                    group: "Gender",
                    name: "Female"
                }
            },
            push: (options: any): void => {                
            }
        };
    });

    describe("OnLoad", () => {
        it("approves the specified category", core.runAsync(async () => {
            let spy = spyOn(service, "updateCategory");

            await sut.OnLoad();

            expect(spy.calls.argsFor(0)[0].group).toEqual("Gender");
            expect(spy.calls.argsFor(0)[0].name).toEqual("Female");
            expect(spy.calls.argsFor(0)[0].visible).toBeTruthy();
        }));
        it("approves the specified category using case insensitive match", core.runAsync(async () => {
            sut.$router.currentRoute.query.group = "gender";
            sut.$router.currentRoute.query.name = "female";

            let spy = spyOn(service, "updateCategory");

            await sut.OnLoad();

            expect(spy.calls.argsFor(0)[0].group).toEqual("Gender");
            expect(spy.calls.argsFor(0)[0].name).toEqual("Female");
            expect(spy.calls.argsFor(0)[0].visible).toBeTruthy();
        }));
        it("redirects to categories when approval completed", core.runAsync(async () => {
            let spy = spyOn(sut.$router, "push");

            await sut.OnLoad();

            expect(spy.calls.argsFor(0)[0].name).toEqual("categories");
        }));
        it("redirects to not found when no matching category found on category group", core.runAsync(async () => {
            sut.$router.currentRoute.query.group = "something";
            sut.$router.currentRoute.query.name = "azure";

            let spy = spyOn(sut.$router, "push");

            await sut.OnLoad();

            expect(spy.calls.argsFor(0)[0].name).toEqual("notfound");
        }));
        it("redirects to not found when no matching category found on category name", core.runAsync(async () => {
            sut.$router.currentRoute.query.group = "skill";
            sut.$router.currentRoute.query.name = "azure";

            let spy = spyOn(sut.$router, "push");

            await sut.OnLoad();

            expect(spy.calls.argsFor(0)[0].name).toEqual("notfound");
        }));
    });
});