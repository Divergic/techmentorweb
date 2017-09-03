import navbar from "./navbar";

describe("navbar.ts", () => {
    let store: any;
    let sut: navbar;

    beforeEach(function () {
        sut = new navbar();
        
        store = {
            getters: {
                idToken: "this is my token",
                isAdministrator: true
            }
        };

        (<any>sut).$store = store;       
    });

    describe("isAdministrator", () => {
        it("returns true when authenticated and is administrator", () => {
            let actual = sut.isAdministrator();

            expect(actual).toBeTruthy();
        });
        it("returns false when authenticated but not an administrator", () => {
            store.getters.isAdministrator = false;
            let actual = sut.isAdministrator();

            expect(actual).toBeFalsy();
        });
        it("returns false when store token is null", () => {
            store.getters.idToken = null;

            let actual = sut.isAdministrator();

            expect(actual).toBeFalsy();
        });
        it("returns false when store token is undefined", () => {
            store.getters.idToken = undefined;

            let actual = sut.isAdministrator();

            expect(actual).toBeFalsy();
        });
        it("returns false when store token is empty", () => {
            store.getters.idToken = "";

            let actual = sut.isAdministrator();

            expect(actual).toBeFalsy();
        });
    });
});