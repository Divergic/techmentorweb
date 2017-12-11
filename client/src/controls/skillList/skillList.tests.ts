import SkillList from "./skillList";
import { Skill } from "../../services/api/skill";

describe("SkillList", () => {
    let sut: SkillList;

    beforeEach(() => {
        // Cancel out the console calls to avoid noisy logging in tests
        spyOn(console, "info");

        let skills = <Array<Skill>>[
            <Skill>{
                name: "Zam"
            },
            <Skill>{
                name: "C#"
            },
            <Skill>{
                name: "Azure"
            }
        ];

        sut = new SkillList();        

        sut.model = skills;
    });

    describe("OnLoad", () => {
        it("ignores null model", () => {
            sut.model = <Array<Skill>><any>null;

            sut.OnLoad();

            // This should not throw an exception
        });
        it("sorts skills alphabetically", () => {
            sut.OnLoad();

            expect(sut.model.length).toEqual(3);
            expect(sut.model[0].name).toEqual("Azure");
            expect(sut.model[1].name).toEqual("C#");
            expect(sut.model[2].name).toEqual("Zam");
        });
    });

    describe("OnAddSkill", () => {
        it("initialises skillModel", () => {
            sut.OnAddSkill();

            expect(sut.skillModel).toBeDefined();
            expect(sut.skillModel.level).toBeNull();
            expect(sut.skillModel.name).toBeNull();
            expect(sut.skillModel.yearLastUsed).toBeNull();
            expect(sut.skillModel.yearStarted).toBeNull();
        });
        it("configures dialog", () => {
            sut.OnAddSkill();

            expect(sut.isSkillAdd).toBeTruthy();
            expect(sut.showDialog).toBeTruthy();
        });
    });

    describe("OnDeleteSkill", () => {
        it("ignores change with null model", () => {
            let skill = <Skill>{
                name: "this"
            };

            sut.model = <Array<Skill>><any>null;

            sut.OnDeleteSkill(skill);
        });
        it("ignores delete when no skill matched", () => {
            let skill = <Skill>{
                name: "this"
            };

            sut.OnDeleteSkill(skill);

            expect(sut.model.length).toEqual(3);
        });
        it("removes matching skill", () => {
            let skill = <Skill>{
                name: "C#"
            };

            sut.OnDeleteSkill(skill);

            expect(sut.model.length).toEqual(2);
            expect(sut.model[0].name).toEqual("Zam");
            expect(sut.model[1].name).toEqual("Azure");
        });
    });

    describe("OnEditSkill", () => {
        it("assigns skillModel", () => {
            let skill = <Skill>{
                name: "this"
            };

            sut.OnEditSkill(skill);

            expect(sut.skillModel).toEqual(skill);
        });
        it("configures dialog", () => {
            let skill = new Skill();

            sut.OnEditSkill(skill);

            expect(sut.isSkillAdd).toBeFalsy();
            expect(sut.showDialog).toBeTruthy();
        });
    });

    describe("OnDialogClose", () => {
        it("hides dialog", () => {
            sut.OnDialogClose();

            expect(sut.showDialog).toBeFalsy();
        });
    });

    describe("OnDialogSave", () => {
        it("does not add skill when dialog action is edit", () => {
            let skill = <Skill>{
                name: "F#"
            };

            sut.isSkillAdd = false;
            sut.OnDialogSave(skill);

            expect(sut.model.length).toEqual(3);
        });
        it("adds skill when dialog action is add", () => {
            let skill = <Skill>{
                name: "F#"
            };

            sut.isSkillAdd = true;
            sut.OnDialogSave(skill);

            expect(sut.model.length).toEqual(4);
            expect(sut.model[2].name).toEqual("F#");
        });
        it("orders new skill", () => {
            let skill = <Skill>{
                name: "F#"
            };

            sut.isSkillAdd = true;
            sut.OnDialogSave(skill);

            expect(sut.model.length).toEqual(4);
            expect(sut.model[2].name).toEqual(skill.name);
        });
        it("hides dialog", () => {
            let skill = <Skill>{
                name: "F#"
            };

            sut.OnDialogSave(skill);

            expect(sut.showDialog).toBeFalsy();
        });
    });
});