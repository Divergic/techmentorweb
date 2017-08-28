import AuthComponent from "./authComponent";

describe("authComponent.ts", () => {
    let store: any;
    let sut: AuthComponent;

    beforeEach(function () {
        sut = new AuthComponent();
        
        store = {
            getters: {
                idToken: "this is my token"
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
});