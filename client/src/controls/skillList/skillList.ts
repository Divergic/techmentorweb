import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Skill } from "../../services/api/skill";
import SkillDetails from "../../controls/skillDetails/skillDetails";
import SkillDialog from "../../components/skillDialog/skillDialog.vue";

@Component({
    components: {
    SkillDetails,
      SkillDialog
    }
  })
export default class SkillList extends Vue {
    
    // Properties for view binding
    public skillModel: Skill = new Skill();
    public isSkillAdd: boolean = false;
    public showDialog: boolean = false;

    @Prop()
    public model: Array<Skill>;

    public mounted(): void {
        this.OnLoad();
    }

    public OnLoad() {
        if (!this.model) {
            return;
        }

        this.orderSkills();
    }

    public OnAddSkill(): void {
        let skill = new Skill();
        
        this.showSkillDialog(skill, true);
    }

    public OnDeleteSkill(skill: Skill): void {
        if (!this.model) {
            return;
        }

        let indexToRemove = -1;
        
        for (let index = 0; index < this.model.length; index++) {
            if (this.model[index].name === skill.name) {
                indexToRemove = index;

                break;
            }
        }

        if (indexToRemove === -1) {
            return;
        }

        this.model.splice(indexToRemove, 1);
    }
    
    public OnEditSkill(skill: Skill): void {
        this.showSkillDialog(skill, false);
    }

    public OnDialogClose(): void {
        this.showDialog = false;
    }

    public OnDialogSave(skill: Skill): void {
        if (this.isSkillAdd) {
            this.model.push(skill);
        }
        
        this.orderSkills();

        this.showDialog = false;
    }

    private showSkillDialog(skill: Skill, isSkillAdd: boolean) {
        this.skillModel = skill;
        this.isSkillAdd = isSkillAdd;

        this.showDialog = true;
    }

    private orderSkills() {        
        this.model.sort((a: Skill, b: Skill) => {
            if (a.name < b.name) {
                return -1;
            }

            if (a.name > b.name) {
                return 1;
            }

            return 0;
        });
    }
}