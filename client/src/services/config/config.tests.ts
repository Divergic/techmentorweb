import { Config } from "./config";

describe("config.ts", () => {

    let sut: Config;

    beforeEach(function () {
        sut = new Config();
    });

    describe("constructor", () => {
        it("populates configuration from json", () => {
            
            expect(sut.apiUri.length).toBeGreaterThan(0, "apiUri");
            expect(sut.authDomain.length).toBeGreaterThan(0, "authDomain");
            expect(sut.clientId.length).toBeGreaterThan(0, "clientId");
            expect(sut.responseType.length).toBeGreaterThan(0, "responseType");
        });
    });
});