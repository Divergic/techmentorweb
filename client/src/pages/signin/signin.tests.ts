import SignIn from "./signin";
import { IAuthenticationService, SignInResponse } from "../../services/authentication/authenticationService";
import Failure from "../../services/failure";

const core = require("../../tests/core");

describe("SignIn", () => {
    let isAuthResponse: boolean;
    let redirectUri: string;
    let relativeRedirectUri: string;
    let currentRoute: any;
    let targetRoute: any;
    let idToken: string | null;
    let tokenExpires: number;
    let response: SignInResponse;
    let service: IAuthenticationService;
    let sut: SignIn;

    beforeEach(() => {
        isAuthResponse = false;
        redirectUri = "https://website.info/profile";
        relativeRedirectUri = "/profile";
        currentRoute = {   
            name: "somewhere"         
        };
        targetRoute = {
            href: "/"
        };
        idToken = null;
        tokenExpires = Date.now() + 180000;
        response = <SignInResponse>{
            accessToken: "access token",
            email: "someone@test.com",
            firstName: "Sam",
            idToken: "new id token",
            isAdministrator: false,
            lastName: "Wise",
            tokenExpires: tokenExpires
        };
        service = <IAuthenticationService>{
            Authenticate: (returnUri: string): void => {                
            },            
            IsAuthResponse: (): boolean => {
                return isAuthResponse;
            },
            ProcessAuthResponse: (): Promise<SignInResponse> => {
                return Promise.resolve(response);
            }
        };

        sut = new SignIn();

        sut.configure(service);
        sut.$route = <any>{
            query: {
                redirectUri: redirectUri
            }
        };
        sut.$router = <any>{
            replace: (options: any) => {                
            },
            currentRoute: currentRoute,
            resolve: (location: any, currentRoute: any): any => {
                return targetRoute;
            }
        };
        sut.$store = <any>{
            getters: {
                idToken: idToken,
                tokenExpires: tokenExpires
            },
            commit: (key: string, value: any): void => {                
            }
        };
    });

    describe("OnLoad", () => {
        it("authenticates when not authenticated", core.runAsync(async () => {
            spyOn(service, "Authenticate");

            await sut.OnLoad();

            expect(service.Authenticate).toHaveBeenCalledWith(redirectUri);
        }));
        it("processes authentication and redirects to specified uri", core.runAsync(async () => {
            isAuthResponse = true;

            let spy = spyOn(sut.$store, "commit");

            spyOn(service, "Authenticate");
            spyOn(sut.$router, "replace");

            await sut.OnLoad();

            expect(service.Authenticate).not.toHaveBeenCalled();
            expect(spy.calls.argsFor(0)[0]).toEqual("accessToken");
            expect(spy.calls.argsFor(0)[1]).toEqual(response.accessToken);
            expect(spy.calls.argsFor(1)[0]).toEqual("email");
            expect(spy.calls.argsFor(1)[1]).toEqual(response.email);
            expect(spy.calls.argsFor(2)[0]).toEqual("firstName");
            expect(spy.calls.argsFor(2)[1]).toEqual(response.firstName);
            expect(spy.calls.argsFor(3)[0]).toEqual("idToken");
            expect(spy.calls.argsFor(3)[1]).toEqual(response.idToken);
            expect(spy.calls.argsFor(4)[0]).toEqual("isAdministrator");
            expect(spy.calls.argsFor(4)[1]).toEqual(response.isAdministrator);
            expect(spy.calls.argsFor(5)[0]).toEqual("lastName");
            expect(spy.calls.argsFor(5)[1]).toEqual(response.lastName);
            expect(spy.calls.argsFor(6)[0]).toEqual("tokenExpires");
            expect(spy.calls.argsFor(6)[1]).toEqual(response.tokenExpires);
            expect(sut.$router.replace).toHaveBeenCalledWith(relativeRedirectUri);
        }));
        it("redirects to specified redirectUri when authenticated", core.runAsync(async () => {
            sut.$store.getters.idToken = "somevalidtoken";
            spyOn(service, "Authenticate");
            spyOn(sut.$router, "replace");

            await sut.OnLoad();

            expect(service.Authenticate).not.toHaveBeenCalled();
            expect(sut.$router.replace).toHaveBeenCalledWith(relativeRedirectUri);
        }));
        it("redirects to home when authenticated and no redirectUri specified", core.runAsync(async () => {
            sut.$store.getters.idToken = "somevalidtoken";
            sut.$route.query.redirectUri = <any>null;

            spyOn(service, "Authenticate");
            spyOn(sut.$router, "replace");

            await sut.OnLoad();

            expect(service.Authenticate).not.toHaveBeenCalled();
            expect(sut.$router.replace).toHaveBeenCalledWith(targetRoute.href);
        }));
        it("sets model with known failure", core.runAsync(async () => {
            let failure = new Failure("Uh oh!");

            service.Authenticate = () => {
                throw failure;
            };
            
            await sut.OnLoad();

            expect(sut.model).toEqual(failure);
        }));
        it("throws error when known failure", core.runAsync(async () => {
            let failure = new Error("Uh oh!");

            service.Authenticate = () => {
                throw failure;
            };
            
            try {
                await sut.OnLoad();
            }
            catch (e) {
                expect(e).toEqual(failure);
            }
        }));
    });

    describe("OnRouteChanged", () => {
        it("invokes OnLoad", core.runAsync(async () => {
            spyOn(sut, "OnLoad");

            await sut.OnRouteChanged();

            expect(sut.OnLoad).toHaveBeenCalled();
        }));
    });
});