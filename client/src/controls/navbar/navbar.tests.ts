import navbar from "./navbar";

describe("navbar.ts", () => {
    let store: any;
    let sut: navbar;

    beforeEach(function () {
        // Cancel out the console calls to avoid noisy logging in tests
        spyOn(console, "info");

        sut = new navbar();
        
        store = {
            getters: {
                idToken: "this is my token",
                isAdministrator: true
            }
        };

        (<any>sut).$store = store;       
    });

    describe("IsAdministrator", () => {
        it("returns true when authenticated and is administrator", () => {
            let actual = sut.IsAdministrator;

            expect(actual).toBeTruthy();
        });
        it("returns false when authenticated but not an administrator", () => {
            store.getters.isAdministrator = false;
            let actual = sut.IsAdministrator;

            expect(actual).toBeFalsy();
        });
        it("returns false when store token is null", () => {
            store.getters.idToken = null;

            let actual = sut.IsAdministrator;

            expect(actual).toBeFalsy();
        });
        it("returns false when store token is undefined", () => {
            store.getters.idToken = undefined;

            let actual = sut.IsAdministrator;

            expect(actual).toBeFalsy();
        });
        it("returns false when store token is empty", () => {
            store.getters.idToken = "";

            let actual = sut.IsAdministrator;

            expect(actual).toBeFalsy();
        });
    });
});