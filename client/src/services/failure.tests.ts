import Failure from "./failure";

describe("Failure", () => {
    describe("constructor", () => {
        it("defaults visibleToUser to true", () => {
            let message = "some failure message";

            let sut = new Failure(message);

            expect(sut.visibleToUser).toBeTruthy();
            expect(sut.message).toEqual(message);
        });
    });
});