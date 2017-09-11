import AuthComponent from "./authComponent";

describe("authComponent.ts", () => {
    let store: any;
    let sut: AuthComponent;
    let futureTime = new Date(Date.now() + 60000);

    beforeEach(function () {
        sut = new AuthComponent();
        
        store = {
            getters: {
                idToken: "this is my token",
                tokenExpires: futureTime.getTime() / 1000
            }
        };

        (<any>sut).$store = store;       
    });

    describe("isAuthenticated", () => {
        it("returns true when store has token", () => {
            let actual = sut.isAuthenticated();

            expect(actual).toBeTruthy();
        });
        it("returns false when store token is null", () => {
            store.getters.idToken = null;

            let actual = sut.isAuthenticated();

            expect(actual).toBeFalsy();
        });
        it("returns false when store token is undefined", () => {
            store.getters.idToken = undefined;

            let actual = sut.isAuthenticated();

            expect(actual).toBeFalsy();
        });
        it("returns false when store token is empty", () => {
            store.getters.idToken = "";

            let actual = sut.isAuthenticated();

            expect(actual).toBeFalsy();
        });
    });

    describe("sessionExpired", () => {
        it("returns true when not authenticated", () => {
            store.getters.idToken = null;

            let actual = sut.sessionExpired();

            expect(actual).toBeTruthy();
        });
        it("returns true when authenticated but tokenExpires is null", () => {
            store.getters.tokenExpires = null;

            let actual = sut.sessionExpired();

            expect(actual).toBeTruthy();
        });
        it("returns true when authenticated but tokenExpires is undefined", () => {
            store.getters.tokenExpires = undefined;

            let actual = sut.sessionExpired();

            expect(actual).toBeTruthy();
        });
        it("returns true when tokenExpires is in the past", () => {
            store.getters.tokenExpires = store.getters.tokenExpires - 60000;

            let actual = sut.sessionExpired();

            expect(actual).toBeTruthy();
        });
        it("returns false when tokenExpires is in the future", () => {
            let actual = sut.sessionExpired();

            expect(actual).toBeFalsy();
        });
    });
});