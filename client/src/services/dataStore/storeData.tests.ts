import StoreData from "./storeData";

describe("StoreData", () => {
    describe("constructor", () => {
        it("defaults all values", () => {
            let actual = new StoreData();

            expect(actual.accessToken).toBeNull();
            expect(actual.email).toBeNull();
            expect(actual.firstName).toBeNull();
            expect(actual.idToken).toBeNull();
            expect(actual.isAdministrator).toBeFalsy();
            expect(actual.lastName).toBeNull();
            expect(actual.tokenExpires).toBeNull();
        });
    });
});