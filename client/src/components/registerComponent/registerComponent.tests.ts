import SignInComponent from "./registerComponent";

describe("registerComponent.ts", () => {
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
        it("invokes register", () => {
            store.getters.idToken = undefined;

            spyOn(sut, "register");

            sut.click();

            expect(sut.register).toHaveBeenCalled();
        });
    });
});