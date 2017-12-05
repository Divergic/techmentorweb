import { UserService } from "./userService";
import { IDataStore } from "../dataStore/dataStore";

describe("UserService", () => {
    let sut: UserService;
    let store: IDataStore;

    beforeEach(() => {
        store = <IDataStore>{
            accessToken: "some token value",
            isAdministrator: true
        };

        sut = new UserService(store);
    });
    
    describe("IsAuthenticated", () => {
        it("returns false when token is null", () => {
            store.accessToken = null;

            let actual = sut.IsAuthenticated;

            expect(actual).toBeFalsy();
        });
        it("returns true when token has value", () => {
            let actual = sut.IsAuthenticated;

            expect(actual).toBeTruthy();
        });
    });
    
    describe("IsAdministrator", () => {
        it("returns store value", () => {
            let actual = sut.IsAuthenticated;

            expect(actual).toEqual(store.isAdministrator);
        });
    });

    describe("SessionExpired", () => {
        it("returns true when not authenticated", () => {
            store.accessToken = null;

            let actual = sut.SessionExpired;

            expect(actual).toBeTruthy();
        });
        it("returns true when token expired", () => {
            store.tokenExpires = (Date.now() / 1000) - 600;

            let actual = sut.SessionExpired;

            expect(actual).toBeTruthy();
        });
        it("returns false when token still valid", () => {
            store.tokenExpires = (Date.now() / 1000) + 600;

            let actual = sut.SessionExpired;

            expect(actual).toBeFalsy();
        });
    });
});