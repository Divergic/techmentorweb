import RegisterButton from "./registerButton";

describe("RegisterButton", () => {
    let sut: RegisterButton;
    let router: any;
    let signInTarget: string = "";
    let signInTargetUri: string = "";

    beforeEach(() => {
        // Cancel out the console calls to avoid noisy logging in tests
        spyOn(console, "info");

        sut = new RegisterButton();
        signInTarget = "accountProfile";
        signInTargetUri = "/profile";
        
        router = {
            currentRoute: {
                meta: {
                    requiresAuth: false,
                    signOutToHome: false,
                    signInTarget: signInTarget
                }
            },
            push: function(data: any) {
            },
            resolve: function(location: any, currentRoute: any) {
                return { href: signInTargetUri} ;
            }
        };
        
        (<any>sut).$router = router;
    });

    describe("OnRouteChanged", () => {
        it("sets disabled to true if on the sign in page", () => {
            router.currentRoute.name = "signin";
            
            sut.OnRouteChanged();

            let actual = sut.disabled;

            expect(actual).toBeTruthy();
        });
        it("sets disabled to false when not on sign in page", () => {
            router.currentRoute.name = "home";

            sut.OnRouteChanged();
            
            let actual = sut.disabled;

            expect(actual).toBeFalsy();
        });
    });
});