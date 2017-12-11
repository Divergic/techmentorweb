import SignInComponent from "./signInComponent";

describe("signInComponent.ts", () => {
    let store: any;
    let sut: SignInComponent;
    let futureTime = new Date(Date.now() + 60000);

    beforeEach(function () {
        // Cancel out the console calls to avoid noisy logging in tests
        spyOn(console, "info");

        sut = new SignInComponent();
        
        store = {
            getters: {
                idToken: "this is my token",
                tokenExpires: futureTime.getTime() / 1000
            },
            commit: function(key: string, value: any) {                
            }
        };

        (<any>sut).$store = store;
    });

    describe("click", () => {
        it("invokes signIn when not authenticated", () => {
            store.getters.idToken = undefined;

            spyOn(sut, "signIn");
            spyOn(sut, "signOut");

            sut.click();

            expect(sut.signIn).toHaveBeenCalled();
            expect(sut.signOut).not.toHaveBeenCalled();
        });
        it("invokes signOut when authenticated", () => {
            spyOn(sut, "signIn");
            spyOn(sut, "signOut");

            sut.click();

            expect(sut.signIn).not.toHaveBeenCalled();
            expect(sut.signOut).toHaveBeenCalled();
        });
    });
    
    describe("text", () => {
        it("returns correct message when authenticated", () => {
            let actual = sut.text;

            expect(actual).toEqual("Sign out");
        });
        it("returns correct message when not authenticated", () => {
            store.getters.idToken = undefined;

            let actual = sut.text;

            expect(actual).toEqual("Sign in");
        });
    });
});