import store from "store";
import { DataStore } from "./dataStore";
import StoreData from "../dataStore/storeData";

describe("store.ts", () => {
    let sut: DataStore;
    let vuex: StoreData;

    beforeEach(() => {
        vuex = <StoreData>{
            accessToken: "This is the access token",
            profileId: "someGuid",
            idToken: "This is the id token"
        };
        sut = new DataStore();
    });

    afterEach(() => {
        store.clearAll();
    });

    describe("accessToken", () => {
        it("returns empty when vuex data is null", () => {
            store.set("vuex", null);

            let actual = sut.accessToken;

            expect(actual).toEqual("");
        });
        it("returns empty when vuex data is undefined", () => {
            store.set("vuex", undefined);

            let actual = sut.accessToken;

            expect(actual).toEqual("");
        });
        it("returns token from storage", () => {
            store.set("vuex", vuex);

            let actual = sut.accessToken;

            expect(actual).toEqual(vuex.accessToken);
        });
    });

    describe("profileId", () => {
        it("returns empty when vuex data is null", () => {
            store.set("vuex", null);

            let actual = sut.profileId;

            expect(actual).toEqual("");
        });
        it("returns empty when vuex data is undefined", () => {
            store.set("vuex", undefined);

            let actual = sut.profileId;

            expect(actual).toEqual("");
        });
        it("returns token from storage", () => {
            store.set("vuex", vuex);

            let actual = sut.profileId;

            expect(actual).toEqual(vuex.profileId);
        });
    });

    describe("idToken", () => {
        it("returns empty when vuex data is null", () => {
            store.set("vuex", null);

            let actual = sut.idToken;

            expect(actual).toEqual("");
        });
        it("returns empty when vuex data is undefined", () => {
            store.set("vuex", undefined);

            let actual = sut.idToken;

            expect(actual).toEqual("");
        });
        it("returns token from storage", () => {
            store.set("vuex", vuex);

            let actual = sut.idToken;

            expect(actual).toEqual(vuex.idToken);
        });
    });
});