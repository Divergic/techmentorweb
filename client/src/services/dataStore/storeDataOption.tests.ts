import * as Vuex from "vuex";
import StoreDataOptions from "./storeDataOptions";
import StoreData from "./storeData";

describe("tokenStateOption.ts", () => {

    let state: StoreData;
    let sut: StoreDataOptions;
    
    beforeEach(() => {
        state = <StoreData>{
            accessToken: "This is the access token",
            isAdministrator: true,
            idToken: "This is the id token",
            tokenExpires: new Date()
        };
        sut = new StoreDataOptions();
    });


    describe("getters.accessToken", () => {
        it("returns stored value", () => {
            let getter = <Vuex.Getter<StoreData, StoreData>>sut.getters["accessToken"];

            let actual = getter(state, null, state, null);
            
            expect(actual).toEqual(state.accessToken);
        });
    });
    
    describe("getters.isAdministrator", () => {
        it("returns stored value", () => {
            let getter = <Vuex.Getter<StoreData, StoreData>>sut.getters["isAdministrator"];

            let actual = getter(state, null, state, null);
            
            expect(actual).toEqual(state.isAdministrator);
        });
    });
    
    describe("getters.idToken", () => {
        it("returns stored value", () => {
            let getter = <Vuex.Getter<StoreData, StoreData>>sut.getters["idToken"];

            let actual = getter(state, null, state, null);
            
            expect(actual).toEqual(state.idToken);
        });
    });

    describe("getters.tokenExpires", () => {
        it("returns stored value", () => {
            let getter = <Vuex.Getter<StoreData, StoreData>>sut.getters["tokenExpires"];

            let actual = getter(state, null, state, null);
            
            expect(actual).toEqual(state.tokenExpires);
        });
    });

    describe("mutations.accessToken", () => {
        it("can store null value", () => {
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["accessToken"];

            setter(state, null);
            
            expect(state.accessToken).toBeNull();
        });
        it("can store undefined value", () => {
            let sut = new StoreDataOptions();
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["accessToken"];

            setter(state, undefined);

            expect(state.accessToken).toBeUndefined();
        });
        it("can store new value", () => {
            let expected = "my new value";
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["accessToken"];

            setter(state, expected);
            
            expect(state.accessToken).toEqual(expected);
        });
    });

    describe("mutations.isAdministrator", () => {
        it("can store null value", () => {
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["isAdministrator"];

            setter(state, null);
            
            expect(state.isAdministrator).toBeFalsy();
        });
        it("can store undefined value", () => {
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["isAdministrator"];

            setter(state, undefined);

            expect(state.isAdministrator).toBeFalsy();
        });
        it("can store new value", () => {
            let expected = false;
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["isAdministrator"];

            setter(state, expected);
            
            expect(state.isAdministrator).toEqual(expected);
        });
    });

    describe("mutations.idToken", () => {
        it("can store null value", () => {
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["idToken"];

            setter(state, null);
            
            expect(state.idToken).toBeNull();
        });
        it("can store undefined value", () => {
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["idToken"];

            setter(state, undefined);

            expect(state.idToken).toBeUndefined();
        });
        it("can store new value", () => {
            let expected = "my new value";
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["idToken"];

            setter(state, expected);
            
            expect(state.idToken).toEqual(expected);
        });
    });

    describe("mutations.tokenExpires", () => {
        it("can store null value", () => {
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["tokenExpires"];

            setter(state, null);
            
            expect(state.tokenExpires).toBeNull();
        });
        it("can store undefined value", () => {
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["tokenExpires"];

            setter(state, undefined);

            expect(state.tokenExpires).toBeUndefined();
        });
        it("can store new value", () => {
            let expected = new Date(Date.now() - 60000);
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["tokenExpires"];

            setter(state, expected);
            
            expect(state.tokenExpires).toEqual(expected);
        });
    });
});