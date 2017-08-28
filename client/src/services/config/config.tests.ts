import { Config } from "./config";

describe("config.ts", () => {

    let sut: Config;

    beforeEach(function () {
        sut = new Config();
    });

    describe("constructor", () => {
        it("populates configuration from json", () => {
            
            expect(sut.apiUri.length).toBeGreaterThan(0);
            expect(sut.authDomain.length).toBeGreaterThan(0);
            expect(sut.authorizeUri.length).toBeGreaterThan(0);
            expect(sut.clientId.length).toBeGreaterThan(0);
            expect(sut.responseType.length).toBeGreaterThan(0);
            expect(sut.sentryUri.length).toBeGreaterThan(0);
        });
    });
});