import AuthButton from "./authButton";
import { ILocation } from "../../services/location";

describe("authButton.ts", () => {
    let href: string = "";
    let signInTarget: string = "";
    let signInTargetUri: string = "";
    let store: any;
    let router: any;
    let location: ILocation;
    let sut: AuthButton;

    beforeEach(function () {
        sut = new AuthButton();
        
        href = "https://www.test.com/stuff?where=here";
        signInTarget = "profile";
        signInTargetUri = "/profile";

        store = {
            getters: {
                idToken: "this is my token"
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

        (<any>sut).$store = store;
        (<any>sut).$router = router;

        location = <ILocation>{
            getHref: function() {
                return href;
            }
        };

        sut.configure(location);         
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
    
    describe("signIn", () => {
        it("authenticates with redirect to route sign in target when sign in target defined", () => {
            spyOn(router, "push");
            spyOn(router, "resolve").and.callThrough();
            
            sut.signIn();

            expect(router.resolve.calls.argsFor(0)[0].name).toEqual(router.currentRoute.meta.signInTarget);
            expect(router.push.calls.argsFor(0)[0].name).toEqual("signin");
            expect(router.push.calls.argsFor(0)[0].query.redirectUri).toEqual(signInTargetUri);
        });
        it("authenticates with redirect to current uri when current route lacks meta", () => {
            spyOn(router, "push");
            router.currentRoute.meta = undefined;

            sut.signIn();           

            expect(router.push.calls.argsFor(0)[0].name).toEqual("signin");
            expect(router.push.calls.argsFor(0)[0].query.redirectUri).toEqual(href);
        });
        it("authenticates with redirect to current uri when sign in target not defined", () => {
            spyOn(router, "push");
            router.currentRoute.meta.signInTarget = undefined;

            sut.signIn();           

            expect(router.push.calls.argsFor(0)[0].name).toEqual("signin");
            expect(router.push.calls.argsFor(0)[0].query.redirectUri).toEqual(href);
        });
    });
    
    describe("signOut", () => {
        it("clears state information", () => {
            spyOn(store, "commit");
            
            sut.signOut();

            expect(store.commit).toHaveBeenCalledWith("accessToken", "");
            expect(store.commit).toHaveBeenCalledWith("email", "");
            expect(store.commit).toHaveBeenCalledWith("firstName", "");
            expect(store.commit).toHaveBeenCalledWith("idToken", "");
            expect(store.commit).toHaveBeenCalledWith("isAdministrator", "");
            expect(store.commit).toHaveBeenCalledWith("lastName", "");
            expect(store.commit).toHaveBeenCalledWith("tokenExpires", "");
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