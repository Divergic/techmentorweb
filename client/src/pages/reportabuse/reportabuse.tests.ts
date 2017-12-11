import ReportAbuse from "./reportabuse";

describe("ReportAbuse", () => {
    let sut: ReportAbuse;

    beforeEach(() => {
        // Cancel out the console calls to avoid noisy logging in tests
        spyOn(console, "info");

        sut = new ReportAbuse();
    });

    describe("constructor", () => {
        it("builds email for view binding fields", () => {
            let expected = "reportabuse@techmentors.info";

            expect(sut.reportAbuseEmailLink).toEqual("mailto:" + expected);
            expect(sut.reportAbuseEmail).toEqual(expected);
        });
    });
});