import store from "store";
import { DataStore } from "./dataStore";
import StoreData from "../dataStore/storeData";

describe("store.ts", () => {
    let sut: DataStore;
    let vuex: StoreData;

    beforeEach(() => {
        vuex = <StoreData>{
            accessToken: "This is the access token",
            email: "here@there.com",
            firstName: "George",
            isAdministrator: true,
            idToken: "This is the id token",
            lastName: "Brown",
            tokenExpires: 1505118903
        };
        sut = new DataStore();
    });

    afterEach(() => {
        store.clearAll();
    });

    describe("accessToken", () => {
        it("returns null when vuex data is null", () => {
            store.set("vuex", null);

            let actual = sut.accessToken;

            expect(actual).toBeNull();
        });
        it("returns null when vuex data is undefined", () => {
            store.set("vuex", undefined);

            let actual = sut.accessToken;

            expect(actual).toBeNull();
        });
        it("returns token from storage", () => {
            store.set("vuex", vuex);

            let actual = sut.accessToken;

            expect(actual).toEqual(vuex.accessToken);
        });
    });

    describe("email", () => {
        it("returns null when vuex data is null", () => {
            store.set("vuex", null);

            let actual = sut.email;

            expect(actual).toBeNull();
        });
        it("returns null when vuex data is undefined", () => {
            store.set("vuex", undefined);

            let actual = sut.email;

            expect(actual).toBeNull();
        });
        it("returns token from storage", () => {
            store.set("vuex", vuex);

            let actual = sut.email;

            expect(actual).toEqual(vuex.email);
        });
    });

    describe("firstName", () => {
        it("returns null when vuex data is null", () => {
            store.set("vuex", null);

            let actual = sut.firstName;

            expect(actual).toBeNull();
        });
        it("returns null when vuex data is undefined", () => {
            store.set("vuex", undefined);

            let actual = sut.firstName;

            expect(actual).toBeNull();
        });
        it("returns token from storage", () => {
            store.set("vuex", vuex);

            let actual = sut.firstName;

            expect(actual).toEqual(vuex.firstName);
        });
    });

    describe("isAdministrator", () => {
        it("returns false when vuex data is null", () => {
            store.set("vuex", null);

            let actual = sut.isAdministrator;

            expect(actual).toBeFalsy();
        });
        it("returns false when vuex data is undefined", () => {
            store.set("vuex", undefined);

            let actual = sut.isAdministrator;

            expect(actual).toBeFalsy();
        });
        it("returns value from storage", () => {
            store.set("vuex", vuex);

            let actual = sut.isAdministrator;

            expect(actual).toEqual(vuex.isAdministrator);
        });
    });

    describe("idToken", () => {
        it("returns null when vuex data is null", () => {
            store.set("vuex", null);

            let actual = sut.idToken;

            expect(actual).toBeNull();
        });
        it("returns null when vuex data is undefined", () => {
            store.set("vuex", undefined);

            let actual = sut.idToken;

            expect(actual).toBeNull();
        });
        it("returns token from storage", () => {
            store.set("vuex", vuex);

            let actual = sut.idToken;

            expect(actual).toEqual(vuex.idToken);
        });
    });
    
    describe("lastName", () => {
        it("returns null when vuex data is null", () => {
            store.set("vuex", null);

            let actual = sut.lastName;

            expect(actual).toBeNull();
        });
        it("returns null when vuex data is undefined", () => {
            store.set("vuex", undefined);

            let actual = sut.lastName;

            expect(actual).toBeNull();
        });
        it("returns token from storage", () => {
            store.set("vuex", vuex);

            let actual = sut.lastName;

            expect(actual).toEqual(vuex.lastName);
        });
    });

    describe("tokenExpires", () => {
        it("returns zero when vuex data is null", () => {
            store.set("vuex", null);

            let actual = sut.tokenExpires;

            expect(actual).toEqual(0);
        });
        it("returns zero when vuex data is undefined", () => {
            store.set("vuex", undefined);

            let actual = sut.tokenExpires;

            expect(actual).toEqual(0);
        });
        it("returns expires from storage", () => {
            store.set("vuex", vuex);

            let actual = sut.tokenExpires;
            
            expect(actual).toEqual(<number>vuex.tokenExpires);
        });
    });
});