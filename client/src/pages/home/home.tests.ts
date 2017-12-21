import Home from "./home";

describe("Home", () => {   
    let sut: Home;

    beforeEach(() => {
        // Cancel out the console calls to avoid noisy logging in tests
        spyOn(console, "info");

        sut = new Home();

        sut.$router = <any>{
            push: (options: any): void => {                
            }
        };
    });

    describe("OnRunSearch", () => {
        it("redirects to search with specified values", () => {
            let genders = new Array<string>("Female");
            let languages = new Array<string>("English");
            let skills = new Array<string>("C#");
            
            let spy = spyOn(sut.$router, "push");
            
            sut.OnRunSearch(genders, languages, skills);
            
            expect(spy.calls.argsFor(0)[0].name).toEqual("search");
            expect(spy.calls.argsFor(0)[0].query.gender.length).toEqual(1);
            expect(spy.calls.argsFor(0)[0].query.gender[0]).toEqual("Female");
            expect(spy.calls.argsFor(0)[0].query.language.length).toEqual(1);
            expect(spy.calls.argsFor(0)[0].query.language[0]).toEqual("English");
            expect(spy.calls.argsFor(0)[0].query.skill.length).toEqual(1);
            expect(spy.calls.argsFor(0)[0].query.skill[0]).toEqual("C#");
        });
    });
});