import AuthFailure from "./authFailure";

describe("authFailure.ts", () => {
    let sut: AuthFailure;
    
    beforeEach(function () {
        sut = new AuthFailure();
        
        sut.error = "access_denied";
        sut.error_description = "User did not authorize the request";
        sut.state = "GhfIFENDVdnzTbL0FLCsy515ofzFIyjw";
    });

    describe("createFrom", () => {
        it("return instance with copied values", () => {
            let actual = AuthFailure.createFrom(sut);
            
            expect(actual.error).toBe(sut.error);
            expect(actual.error_description).toBe(sut.error_description);
            expect(actual.state).toBe(sut.state);

            let valid = actual.isFailure();

            expect(valid).toBeTruthy();
        });
        it("return instance with undefined values when source is undefined", () => {
            // The cast is so that TypeScript doesn't freak out when providing undefined
            let actual = (<any>AuthFailure).createFrom(undefined);
            
            expect(actual.error).toBeUndefined;
            expect(actual.error_description).toBeUndefined;
            expect(actual.state).toBeUndefined;
        });
        it("return instance with undefined values when source is null", () => {
            // The cast is so that TypeScript doesn't freak out when providing null
            let actual = (<any>AuthFailure).createFrom(null);
            
            expect(actual.error).toBeUndefined;
            expect(actual.error_description).toBeUndefined;
            expect(actual.state).toBeUndefined;
        });
    });

    describe("isFailure", () => {
        it("return true when all values are present", () => {
            let actual = sut.isFailure();
            
            expect(actual).toBeTruthy();
        });
        it("return false when error is undefined", () => {
            (<any>sut).error = undefined;

            let actual = sut.isFailure();
            
            expect(actual).not.toBeTruthy();
        });
        it("return false when error is null", () => {
            (<any>sut).error = null;

            let actual = sut.isFailure();
            
            expect(actual).not.toBeTruthy();
        });
        it("return false when error is empty", () => {
            sut.error = "";

            let actual = sut.isFailure();
            
            expect(actual).not.toBeTruthy();
        });
        it("return false when error_description is undefined", () => {
            (<any>sut).error_description = undefined;

            let actual = sut.isFailure();
            
            expect(actual).not.toBeTruthy();
        });
        it("return false when error_description is null", () => {
            (<any>sut).error_description = null;

            let actual = sut.isFailure();
            
            expect(actual).not.toBeTruthy();
        });
        it("return false when error_description is empty", () => {
            sut.error_description = "";

            let actual = sut.isFailure();
            
            expect(actual).not.toBeTruthy();
        });
        it("return false when state is undefined", () => {
            (<any>sut).state = undefined;

            let actual = sut.isFailure();
            
            expect(actual).not.toBeTruthy();
        });
        it("return false when state is null", () => {
            (<any>sut).state = null;

            let actual = sut.isFailure();
            
            expect(actual).not.toBeTruthy();
        });
        it("return false when state is empty", () => {
            sut.state = "";

            let actual = sut.isFailure();
            
            expect(actual).not.toBeTruthy();
        });
    });
});