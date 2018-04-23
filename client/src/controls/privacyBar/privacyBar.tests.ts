import PrivacyBar from "./privacyBar";

describe("PrivacyBar", () => {
    let sut: PrivacyBar;

    beforeEach(() => {
        sut = new PrivacyBar();
        
        (<any>sut).$emit = (eventName: string) => {
        };

    });

    describe("constructor", () => {
        it("sets showConfirm to false", () => {
            let actual = sut.showConfirm;

            expect(actual).toBeFalsy();
        });
    });

    describe("OnShowConfirm", () => {
        it("set showConfirm to true", () => {
            sut.OnShowConfirm();

            let actual = sut.showConfirm;

            expect(actual).toBeTruthy();
        });
    });

    describe("OnHide", () => {
        it("emits onHide event", () => {
            spyOn(sut, "$emit");

            sut.OnHide();

            expect(sut.$emit).toHaveBeenCalledWith("onHide");
        });
    });

    describe("OnHide", () => {
        it("emits onHide event", () => {
            spyOn(sut, "$emit");

            sut.OnHide();

            expect(sut.$emit).toHaveBeenCalledWith("onHide");
        });
    });

    describe("OnExport", () => {
        it("emits onExport event", () => {
            spyOn(sut, "$emit");

            sut.OnExport();

            expect(sut.$emit).toHaveBeenCalledWith("onExport");
        });
    });

    describe("OnCancelDelete", () => {
        it("hides confirmation", () => {
            sut.OnCancelDelete();

            let actual = sut.showConfirm;

            expect(actual).toBeFalsy();
        });
        it("does not emit onDelete event", () => {
            spyOn(sut, "$emit");

            sut.OnCancelDelete();

            expect(sut.$emit).not.toHaveBeenCalledWith("onDelete");
        });
    });

    describe("OnDelete", () => {
        it("emits onDelete event", () => {
            spyOn(sut, "$emit");

            sut.OnDelete();

            expect(sut.$emit).toHaveBeenCalledWith("onDelete");
        });
        it("hides confirmation", () => {
            sut.OnDelete();

            let actual = sut.showConfirm;

            expect(actual).toBeFalsy();
        });
    });
});