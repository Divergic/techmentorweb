import * as Vuex from "vuex";
import StoreDataOptions from "./storeDataOptions";
import StoreData from "./storeData";

describe("tokenStateOption.ts", () => {

    let state: StoreData;
    let sut: StoreDataOptions;
    
    beforeEach(() => {
        state = <StoreData>{
            accessToken: "This is the access token",
            email: "here@there.com",
            firstName: "George",
            idToken: "This is the id token",
            isAdministrator: true,
            lastName: "Brown",
            tokenExpires: 1505118903
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
    
    describe("getters.email", () => {
        it("returns stored value", () => {
            let getter = <Vuex.Getter<StoreData, StoreData>>sut.getters["email"];

            let actual = getter(state, null, state, null);
            
            expect(actual).toEqual(state.email);
        });
    });
    
    describe("getters.firstName", () => {
        it("returns stored value", () => {
            let getter = <Vuex.Getter<StoreData, StoreData>>sut.getters["firstName"];

            let actual = getter(state, null, state, null);
            
            expect(actual).toEqual(state.firstName);
        });
    });
    
    describe("getters.idToken", () => {
        it("returns stored value", () => {
            let getter = <Vuex.Getter<StoreData, StoreData>>sut.getters["idToken"];

            let actual = getter(state, null, state, null);
            
            expect(actual).toEqual(state.idToken);
        });
    });

    describe("getters.isAdministrator", () => {
        it("returns stored value", () => {
            let getter = <Vuex.Getter<StoreData, StoreData>>sut.getters["isAdministrator"];

            let actual = getter(state, null, state, null);
            
            expect(actual).toEqual(state.isAdministrator);
        });
    });
    
    describe("getters.lastName", () => {
        it("returns stored value", () => {
            let getter = <Vuex.Getter<StoreData, StoreData>>sut.getters["lastName"];

            let actual = getter(state, null, state, null);
            
            expect(actual).toEqual(state.lastName);
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

    describe("mutations.email", () => {
        it("can store null value", () => {
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["email"];

            setter(state, null);
            
            expect(state.email).toBeNull();
        });
        it("can store undefined value", () => {
            let sut = new StoreDataOptions();
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["email"];

            setter(state, undefined);

            expect(state.email).toBeUndefined();
        });
        it("can store new value", () => {
            let expected = "my new value";
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["email"];

            setter(state, expected);
            
            expect(state.email).toEqual(expected);
        });
    });

    describe("mutations.firstName", () => {
        it("can store null value", () => {
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["firstName"];

            setter(state, null);
            
            expect(state.firstName).toBeNull();
        });
        it("can store undefined value", () => {
            let sut = new StoreDataOptions();
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["firstName"];

            setter(state, undefined);

            expect(state.firstName).toBeUndefined();
        });
        it("can store new value", () => {
            let expected = "my new value";
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["firstName"];

            setter(state, expected);
            
            expect(state.firstName).toEqual(expected);
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

    describe("mutations.lastName", () => {
        it("can store null value", () => {
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["lastName"];

            setter(state, null);
            
            expect(state.lastName).toBeNull();
        });
        it("can store undefined value", () => {
            let sut = new StoreDataOptions();
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["lastName"];

            setter(state, undefined);

            expect(state.lastName).toBeUndefined();
        });
        it("can store new value", () => {
            let expected = "my new value";
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["lastName"];

            setter(state, expected);
            
            expect(state.lastName).toEqual(expected);
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
            let expected = 1505228903;
            let setter = <Vuex.Mutation<StoreData>>sut.mutations["tokenExpires"];

            setter(state, expected);
            
            expect(state.tokenExpires).toEqual(expected);
        });
    });
});