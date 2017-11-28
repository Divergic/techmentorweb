import AccountProfileAlerts from "./accountProfileAlerts";
import { AccountProfile, ProfileStatus } from "../../services/api/accountProfileService";
import { Skill } from "../../services/api/skill";

describe("AccountProfileAlerts", () => {
    let model: AccountProfile;
    let sut: AccountProfileAlerts;

    beforeEach(() => {
        model = new AccountProfile();

        model.status = ProfileStatus.Available;
        model.gender = "Female";
        model.languages.push("English");
        model.skills.push(<Skill>{name: "C#"});
    
        sut = new AccountProfileAlerts();
        
        sut.model = model;
    });

    describe("IsBanned", () => {
        it("returns false when bannedAt is null", () => {
            let actual = sut.IsBanned();

            expect(actual).toBeFalsy();
        });
        it("returns true when bannedAt has a value", () => {
            model.bannedAt = new Date(Date.now());

            let actual = sut.IsBanned();
            
            expect(actual).toBeTruthy();
        });
    });

    describe("IsHidden", () => {
        it("returns false when status is Unavailable", () => {
            model.status = ProfileStatus.Unavailable;

            let actual = sut.IsHidden();

            expect(actual).toBeFalsy();
        });
        it("returns false when status is Available", () => {
            model.status = ProfileStatus.Available;

            let actual = sut.IsHidden();

            expect(actual).toBeFalsy();
        });
        it("returns true when status is Hidden", () => {
            model.status = ProfileStatus.Hidden;

            let actual = sut.IsHidden();
            
            expect(actual).toBeTruthy();
        });
    });

    describe("IsSearchable", () => {
        it("returns true when not hidden and has all categories", () => {
            let actual = sut.IsSearchable();

            expect(actual).toBeTruthy();
        });
        it("returns true when not hidden and has a gender", () => {
            model.languages = new Array<string>();
            model.skills = new Array<Skill>();
            
            let actual = sut.IsSearchable();

            expect(actual).toBeTruthy();
        });
        it("returns true when not hidden and has a language", () => {
            model.gender = null;
            model.skills = new Array<Skill>();
            
            let actual = sut.IsSearchable();

            expect(actual).toBeTruthy();
        });
        it("returns true when not hidden and has a skill", () => {
            model.gender = null;
            model.languages = new Array<string>();
            
            let actual = sut.IsSearchable();

            expect(actual).toBeTruthy();
        });
        it("returns false when hidden", () => {
            model.status = ProfileStatus.Hidden;
            
            let actual = sut.IsSearchable();

            expect(actual).toBeFalsy();
        });
        it("returns false when not hidden but no categories found", () => {
            model.status = ProfileStatus.Available;
            model.gender = null;
            model.languages = new Array<string>();
            model.skills = new Array<Skill>();
            
            let actual = sut.IsSearchable();

            expect(actual).toBeFalsy();
        });
        it("returns false when not hidden but no categories found with null skills and languages", () => {
            model.status = ProfileStatus.Available;
            model.gender = null;
            model.languages = <Array<string>><any>null;
            model.skills = <Array<Skill>><any>null;
            
            let actual = sut.IsSearchable();

            expect(actual).toBeFalsy();
        });
        it("returns false when not hidden but no categories found with undefined skills and languages", () => {
            model.status = ProfileStatus.Available;
            model.gender = null;
            model.languages = <Array<string>><any>undefined;
            model.skills = <Array<Skill>><any>undefined;
            
            let actual = sut.IsSearchable();

            expect(actual).toBeFalsy();
        });
    });
});