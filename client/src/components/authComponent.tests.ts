import AuthComponent from "./authComponent";
import { ILocation } from "../services/location";

describe("authComponent.ts", () => {
    let href: string = "";
    let signInTarget: string = "";
    let signInTargetUri: string = "";
    let router: any;
    let location: ILocation;
    let store: any;
    let sut: AuthComponent;
    let futureTime = new Date(Date.now() + 60000);

    beforeEach(function () {
        // Cancel out the console calls to avoid noisy logging in tests
        spyOn(console, "info");
        spyOn(console, "warn");

        sut = new AuthComponent();
        
        href = "https://www.test.com/stuff?where=here";
        signInTarget = "accountProfile";
        signInTargetUri = "/profile";

        store = {
            getters: {
                idToken: "this is my token",
                tokenExpires: futureTime.getTime() / 1000
            },
            commit: function(key: string, value: any) {                
            }
        };
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

        location = <ILocation>{
            getHref: function() {
                return href;
            }
        };

        (<any>sut).$store = store;
        (<any>sut).$router = router;
        
        sut.init(location);
    });

    describe("IsAuthenticated", () => {
        it("returns true when store has token", () => {
            let actual = sut.IsAuthenticated;

            expect(actual).toBeTruthy();
        });
        it("returns false when store token is null", () => {
            store.getters.idToken = null;

            let actual = sut.IsAuthenticated;

            expect(actual).toBeFalsy();
        });
        it("returns false when store token is undefined", () => {
            store.getters.idToken = undefined;

            let actual = sut.IsAuthenticated;

            expect(actual).toBeFalsy();
        });
        it("returns false when store token is empty", () => {
            store.getters.idToken = "";

            let actual = sut.IsAuthenticated;

            expect(actual).toBeFalsy();
        });
    });

    describe("SessionExpired", () => {
        it("returns true when not authenticated", () => {
            store.getters.idToken = null;

            let actual = sut.SessionExpired;

            expect(actual).toBeTruthy();
        });
        it("returns true when authenticated but tokenExpires is null", () => {
            store.getters.tokenExpires = null;

            let actual = sut.SessionExpired;

            expect(actual).toBeTruthy();
        });
        it("returns true when authenticated but tokenExpires is undefined", () => {
            store.getters.tokenExpires = undefined;

            let actual = sut.SessionExpired;

            expect(actual).toBeTruthy();
        });
        it("returns true when tokenExpires is in the past", () => {
            store.getters.tokenExpires = store.getters.tokenExpires - 60000;

            let actual = sut.SessionExpired;

            expect(actual).toBeTruthy();
        });
        it("returns false when tokenExpires is in the future", () => {
            let actual = sut.SessionExpired;

            expect(actual).toBeFalsy();
        });
    });
    
    describe("register", () => {
        it("authenticates with redirect to route sign in target when sign in target defined", () => {
            spyOn(router, "push");
            spyOn(router, "resolve").and.callThrough();
            
            sut.register();

            expect(router.resolve.calls.argsFor(0)[0].name).toEqual(router.currentRoute.meta.signInTarget);
            expect(router.push.calls.argsFor(0)[0].name).toEqual("signin");
            expect(router.push.calls.argsFor(0)[0].query.redirectUri).toEqual(signInTargetUri);
            expect(router.push.calls.argsFor(0)[0].query.mode).toEqual("signUp");
        });
        it("authenticates with redirect to current uri when current route lacks meta", () => {
            spyOn(router, "push");
            router.currentRoute.meta = undefined;

            sut.register();           

            expect(router.push.calls.argsFor(0)[0].name).toEqual("signin");
            expect(router.push.calls.argsFor(0)[0].query.redirectUri).toEqual(href);
            expect(router.push.calls.argsFor(0)[0].query.mode).toEqual("signUp");
        });
        it("authenticates with redirect to current uri when sign in target not defined", () => {
            spyOn(router, "push");
            router.currentRoute.meta.signInTarget = undefined;

            sut.register();           

            expect(router.push.calls.argsFor(0)[0].name).toEqual("signin");
            expect(router.push.calls.argsFor(0)[0].query.redirectUri).toEqual(href);
            expect(router.push.calls.argsFor(0)[0].query.mode).toEqual("signUp");
        });
    });
    
    describe("signIn", () => {
        it("authenticates with redirect to route sign in target when sign in target defined", () => {
            spyOn(router, "push");
            spyOn(router, "resolve").and.callThrough();
            
            sut.signIn();

            expect(router.resolve.calls.argsFor(0)[0].name).toEqual(router.currentRoute.meta.signInTarget);
            expect(router.push.calls.argsFor(0)[0].name).toEqual("signin");
            expect(router.push.calls.argsFor(0)[0].query.redirectUri).toEqual(signInTargetUri);
            expect(router.push.calls.argsFor(0)[0].query.mode).toBeUndefined();
        });
        it("authenticates with redirect to current uri when current route lacks meta", () => {
            spyOn(router, "push");
            router.currentRoute.meta = undefined;

            sut.signIn();           

            expect(router.push.calls.argsFor(0)[0].name).toEqual("signin");
            expect(router.push.calls.argsFor(0)[0].query.redirectUri).toEqual(href);
            expect(router.push.calls.argsFor(0)[0].query.mode).toBeUndefined();
        });
        it("authenticates with redirect to current uri when sign in target not defined", () => {
            spyOn(router, "push");
            router.currentRoute.meta.signInTarget = undefined;

            sut.signIn();           

            expect(router.push.calls.argsFor(0)[0].name).toEqual("signin");
            expect(router.push.calls.argsFor(0)[0].query.redirectUri).toEqual(href);
            expect(router.push.calls.argsFor(0)[0].query.mode).toBeUndefined();
        });
    });
    
    describe("signOut", () => {
        it("clears state information", () => {
            spyOn(store, "commit");
            
            sut.signOut();

            expect(store.commit).toHaveBeenCalledWith("accessToken", null);
            expect(store.commit).toHaveBeenCalledWith("email", null);
            expect(store.commit).toHaveBeenCalledWith("firstName", null);
            expect(store.commit).toHaveBeenCalledWith("idToken", null);
            expect(store.commit).toHaveBeenCalledWith("isAdministrator", false);
            expect(store.commit).toHaveBeenCalledWith("lastName", null);
            expect(store.commit).toHaveBeenCalledWith("tokenExpires", null);
        });
        it("does not redirect if current route lacks meta", () => {
            spyOn(router, "push");
            
            router.currentRoute.meta = null;
            
            sut.signOut();

            expect(router.push).not.toHaveBeenCalled();
        });
        it("does not redirect if current route allows anonymous users", () => {
            spyOn(router, "push");
            
            sut.signOut();

            expect(router.push).not.toHaveBeenCalled();
        });
        it("redirects to home if current route requires authenticated users", () => {
            spyOn(router, "push");

            router.currentRoute.meta.requiresAuth = true;
            
            sut.signOut();

            let data = router.push.calls.argsFor(0)[0];

            expect(router.push).toHaveBeenCalled();
            expect(data.name).toEqual("home");
        });
        it("redirects to home if current route requires sign out to home", () => {
            spyOn(router, "push");

            router.currentRoute.meta.signOutToHome = true;
            
            sut.signOut();

            let data = router.push.calls.argsFor(0)[0];

            expect(router.push).toHaveBeenCalled();
            expect(data.name).toEqual("home");
        });
    });
    
    describe("EvaluateDisabled", () => {
        it("sets disabled to true if on the sign in page", () => {
            router.currentRoute.name = "signin";
            
            sut.EvaluateDisabled();

            let actual = sut.disabled;

            expect(actual).toBeTruthy();
        });
        it("sets disabled to false when not on sign in page", () => {
            router.currentRoute.name = "home";

            sut.EvaluateDisabled();
            
            let actual = sut.disabled;

            expect(actual).toBeFalsy();
        });
    });
});