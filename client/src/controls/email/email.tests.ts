import Email from "./email";

describe("Email", () => {
    let name = "someone";
    let domain = "testing.com";

    let sut: Email = new Email();

    beforeEach(() => {
        sut.name = name;
        sut.domain = domain;
    });

    describe("Address", () => {
        it("returns empty when name is undefined", () => {
            sut.name = <string><any>undefined;

            let actual = sut.Address;

            expect(actual).toEqual("");
        });
        it("returns empty when name is null", () => {
            sut.name = <string><any>null;

            let actual = sut.Address;

            expect(actual).toEqual("");
        });
        it("returns empty when name is empty", () => {
            sut.name = "";

            let actual = sut.Address;

            expect(actual).toEqual("");
        });
        it("returns empty when domain is undefined", () => {
            sut.domain = <string><any>undefined;

            let actual = sut.Address;

            expect(actual).toEqual("");
        });
        it("returns empty when domain is null", () => {
            sut.domain = <string><any>null;

            let actual = sut.Address;

            expect(actual).toEqual("");
        });
        it("returns empty when domain is empty", () => {
            sut.domain = "";

            let actual = sut.Address;

            expect(actual).toEqual("");
        });
        it("returns email address when data is available", () => {
            let actual = sut.Address;

            expect(actual).toEqual(name + "@" + domain);
        });
    });

    describe("Link", () => {
        it("returns empty when name is undefined", () => {
            sut.name = <string><any>undefined;

            let actual = sut.Link;

            expect(actual).toEqual("");
        });
        it("returns empty when name is null", () => {
            sut.name = <string><any>null;

            let actual = sut.Link;

            expect(actual).toEqual("");
        });
        it("returns empty when name is empty", () => {
            sut.name = "";

            let actual = sut.Link;

            expect(actual).toEqual("");
        });
        it("returns empty when domain is undefined", () => {
            sut.domain = <string><any>undefined;

            let actual = sut.Link;

            expect(actual).toEqual("");
        });
        it("returns empty when domain is null", () => {
            sut.domain = <string><any>null;

            let actual = sut.Link;

            expect(actual).toEqual("");
        });
        it("returns empty when domain is empty", () => {
            sut.domain = "";

            let actual = sut.Link;

            expect(actual).toEqual("");
        });
        it("returns email link when data is available", () => {
            let actual = sut.Link;

            expect(actual).toEqual("mailto:" + name + "@" + domain);
        });
    });

    describe("Visible", () => {
        it("returns false when name is undefined", () => {
            sut.name = <string><any>undefined;

            let actual = sut.Visible;

            expect(actual).toBeFalsy();
        });
        it("returns false when name is null", () => {
            sut.name = <string><any>null;

            let actual = sut.Visible;

            expect(actual).toBeFalsy();
        });
        it("returns false when name is empty", () => {
            sut.name = "";

            let actual = sut.Visible;

            expect(actual).toBeFalsy();
        });
        it("returns false when domain is undefined", () => {
            sut.domain = <string><any>undefined;

            let actual = sut.Visible;

            expect(actual).toBeFalsy();
        });
        it("returns false when domain is null", () => {
            sut.domain = <string><any>null;

            let actual = sut.Visible;

            expect(actual).toBeFalsy();
        });
        it("returns false when domain is empty", () => {
            sut.domain = "";

            let actual = sut.Visible;

            expect(actual).toBeFalsy();
        });
        it("returns true when data is available", () => {
            let actual = sut.Visible;

            expect(actual).toBeTruthy();
        });
    });
});