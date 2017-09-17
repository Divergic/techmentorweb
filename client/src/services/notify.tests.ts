import { Notify } from "./notify";
import Failure from "./failure";

describe("notify.ts", () => {

    let toast = {
        error: function(options) {
        },
        success: function(options) {
        },
        info: function(options) {
        },
        warning: function(options) {
        }
    };

    describe("constructor", () => {
        it("can create default instance", () => {
            let sut = new Notify();

            expect(sut).not.toBeNull;
        });
    });
    
    describe("showError", () => {
        it("displays error message", () => {
            let message = "This is my error message";

            let spy = spyOn(toast, "error");
            let sut = new Notify(toast);

            sut.showError(message);    
            
            expect(spy.calls.argsFor(0)[0].message).toEqual(message);
        });
    });
    
    describe("showFailure", () => {
        let failure = new Failure("This is my failure message");

        it("displays failure message", () => {
            let spy = spyOn(toast, "error");
            let sut = new Notify(toast);

            sut.showFailure(failure);    
            
            expect(spy.calls.argsFor(0)[0].message).toEqual(failure.message);
        });
    });
    
    describe("showInformation", () => {
        it("displays information message", () => {
            let message = "This is my information message";

            let spy = spyOn(toast, "info");
            let sut = new Notify(toast);

            sut.showInformation(message);    
            
            expect(spy.calls.argsFor(0)[0].message).toEqual(message);
        });
    });
    
    describe("showSuccess", () => {
        it("displays success message", () => {
            let message = "This is my success message";

            let spy = spyOn(toast, "success");
            let sut = new Notify(toast);

            sut.showSuccess(message);    
            
            expect(spy.calls.argsFor(0)[0].message).toEqual(message);
        });
    });
    
    describe("showWarning", () => {
        it("displays warning message", () => {
            let message = "This is my warning message";

            let spy = spyOn(toast, "warning");
            let sut = new Notify(toast);

            sut.showWarning(message);    
            
            expect(spy.calls.argsFor(0)[0].message).toEqual(message);
        });
    });
});