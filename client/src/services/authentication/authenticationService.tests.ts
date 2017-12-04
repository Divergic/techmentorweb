import { AuthenticationService } from "./authenticationService";
import { ILocation } from "../location";
import { IAuthWrapper } from "./authWrapper";
import AuthFailure from "./authFailure";

const core = require("../../tests/core");

type AuthCallback = (err: any, authResult: any) => void;

describe("AuthenticationService", () => {
    let hash: string;
    let callbackUri: string;
    let authFailure: AuthFailure;
    let authError: any;
    let authResult: any;
    let location: ILocation;
    let wrapper: IAuthWrapper;
    let sut: AuthenticationService;

    beforeEach(() => {
        hash = "somehash";
        callbackUri = "callback/uri";
        authFailure = new AuthFailure();
        authError = null;
        authResult = null;

        location = <ILocation>{
            getHash: () => {
                return hash;
            },
            getSignInUri: (returnUri: string): string => {
                return callbackUri;
            },
            fromHash: (): AuthFailure => {
                return authFailure;
            }
        };
        wrapper = <IAuthWrapper>{
            authorize: (redirectUri: string) => {
            },
            parseHash: (callback: AuthCallback): void => {
                callback(authError, authResult);
            }
        };
        sut = new AuthenticationService(location, wrapper);
    });

    describe("IsAuthResponse", () => {
        it("returns true when hash exists", () => {
            let actual = sut.IsAuthResponse();

            expect(actual).toBeTruthy();
        });
        it("returns false when hash is null", () => {
            hash = <string><any>null;
            let actual = sut.IsAuthResponse();

            expect(actual).toBeFalsy();
        });
        it("returns false when hash is empty", () => {
            hash = "";
            let actual = sut.IsAuthResponse();

            expect(actual).toBeFalsy();
        });
    });

    describe("Authenticate", () => {
        it("executes authorisation with the callbackUri", () => {
            let redirectUri = "/profile";

            spyOn(location, "getSignInUri").and.callThrough();
            spyOn(wrapper, "authorize");

            sut.Authenticate(redirectUri);

            expect(location.getSignInUri).toHaveBeenCalledWith(redirectUri);
            expect(wrapper.authorize).toHaveBeenCalledWith(callbackUri);
        });
    });

    describe("ProcessAuthResponse", () => {
        it("throws known failure when identified in hash", core.runAsync(async () => {            
            authFailure.error = "some error";
            authFailure.error_description = "some description";
            authFailure.state = "some state";

            try {
                await sut.ProcessAuthResponse();
            }
            catch (e) {
                expect(e.message).toEqual(authFailure.error_description);
            }
        }));
        it("throws exception when parseHash fails", core.runAsync(async () => {
            authError = new Error("Uh oh!");

            try {
                await sut.ProcessAuthResponse();
            }
            catch (e) {
                expect(e).toEqual(authError);
            }
        }));
        it("sets identity information with auth response values", core.runAsync(async () => {
            authResult = {
                idTokenPayload: {
                    email: "fred.goods@test.com",
                    given_name: "Fred",
                    family_name: "Goods",
                    iat: Date.now()
                },
                expiresIn: Date.now() + 600000
            };

            let actual = await sut.ProcessAuthResponse();

            expect(actual.email).toEqual(authResult.idTokenPayload.email);
            expect(actual.firstName).toEqual(authResult.idTokenPayload.given_name);
            expect(actual.lastName).toEqual(authResult.idTokenPayload.family_name);
        }));
        it("sets token expiry with auth response values", core.runAsync(async () => {
            authResult = {
                idTokenPayload: {
                    email: "sue.jones@test.com",
                    given_name: "Sue",
                    family_name: "Jones",
                    iat: Date.now()
                },
                expiresIn: Date.now() + 600000
            };

            let expected = authResult.idTokenPayload.iat
                + authResult.expiresIn - 180;

            let actual = await sut.ProcessAuthResponse();
                
            expect(actual.tokenExpires).toEqual(expected);
        }));
        it("does not set isAdministrator when roles array is null", core.runAsync(async () => {
            authResult = {
                idTokenPayload: {
                    email: "sue.jones@test.com",
                    given_name: "Sue",
                    family_name: "Jones",
                    iat: Date.now()
                },
                expiresIn: Date.now() + 600000
            };

            let actual = await sut.ProcessAuthResponse();
                
            expect(actual.isAdministrator).toBeFalsy();
        }));
        it("does not set isAdministrator when roles array is empty", core.runAsync(async () => {
            authResult = {
                idTokenPayload: {
                    email: "sue.jones@test.com",
                    given_name: "Sue",
                    family_name: "Jones",
                    iat: Date.now(),
                    "http://techmentor/roles": new Array<string>()
                },
                expiresIn: Date.now() + 600000
            };

            let actual = await sut.ProcessAuthResponse();
                
            expect(actual.isAdministrator).toBeFalsy();
        }));
        it("does not set isAdministrator when roles array has other role", core.runAsync(async () => {
            authResult = {
                idTokenPayload: {
                    email: "sue.jones@test.com",
                    given_name: "Sue",
                    family_name: "Jones",
                    iat: Date.now(),
                    "http://techmentor/roles": new Array<string>("Power User")
                },
                expiresIn: Date.now() + 600000
            };

            let actual = await sut.ProcessAuthResponse();
                
            expect(actual.isAdministrator).toBeFalsy();
        }));
        it("sets isAdministrator when roles array has Administrator", core.runAsync(async () => {
            authResult = {
                idTokenPayload: {
                    email: "sue.jones@test.com",
                    given_name: "Sue",
                    family_name: "Jones",
                    iat: Date.now(),
                    "http://techmentor/roles": new Array<string>("Power User", "Administrator")
                },
                expiresIn: Date.now() + 600000
            };

            let actual = await sut.ProcessAuthResponse();
                
            expect(actual.isAdministrator).toBeTruthy();
        }));
    });
});