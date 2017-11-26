import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Skill } from "../../services/api/skill";
import { INotify, Notify } from "../../services/notify";
import { IListsService, ListsService, ListItem } from "../../services/lists";
import { ICategoriesService, CategoriesService, Category, CategoryGroup } from "../../services/api/categoriesService";

@Component
export default class SkillDialog extends Vue {
    private listsService: IListsService;
    private categoriesService: ICategoriesService;
    private notify: INotify;

    // View model properties
    public techYears: Array<number> = new Array<number>();
    public techYearsStarted: Array<number> = new Array<number>();
    public techYearsLastUsed: Array<number> = new Array<number>();
    public skills: Array<string> = new Array<string>();
    public skillLevels: Array<ListItem<string>> = new Array<ListItem<string>>();
    public availableSkills: Array<string> = new Array<string>();
    
    @Prop()
    public usedSkills: Array<Skill>;

    @Prop()
    public model: Skill;

    @Prop()
    public isAdd: boolean;
    
    @Prop()
    public visible: boolean;

    public constructor() {
        super();
        
        this.listsService = new ListsService();
        this.categoriesService = new CategoriesService();
        this.notify = new Notify();
    }
    
    public configure(listsService: IListsService, categoriesService: ICategoriesService, notify: INotify) {
        this.listsService = listsService;
        this.categoriesService = categoriesService;
        this.notify = notify;
    }

    public mounted(): Promise<void> {
        return this.OnLoad();
    }

    public async OnLoad(): Promise<void> {
        this.techYears = this.listsService.getTechYears();
        this.skillLevels = this.listsService.getSkillLevels();

        let categories = await this.categoriesService.getCategories();

        this.skills = categories
            .filter((item: Category) => {
                return item.group === CategoryGroup.Skill;
            }).map((item: Category) => {
                return item.name;
            });
    }

    @Watch("usedSkills")
    public SkillsChanged(): void {
        this.availableSkills = this.skills.filter((skill: string) => {
            let matchingSkills = this.usedSkills.filter((usedSkill: Skill) => {
                return skill.toLocaleUpperCase() === usedSkill.name.toLocaleUpperCase();
            });
            
            return (matchingSkills.length === 0);
        });
    }

    @Watch("model.yearStarted")
    public YearStartedChanged(): void {
        if (!this.model.yearStarted) {
            this.techYearsLastUsed = this.techYears;

            return;
        }

        let started: number = this.model.yearStarted;
        
        this.techYearsLastUsed = this.techYears
            .filter((item: number) => {
                return item >= started;
            });
    }

    @Watch("model.yearLastUsed")
    public YearLastUsedChanged(): void {
        if (!this.model.yearLastUsed) {
            this.techYearsStarted = this.techYears;

            return;
        }

        let lastUsed: number = this.model.yearLastUsed;

        this.techYearsStarted = this.techYears
            .filter((item: number) => {
                return item <= lastUsed;
            });
    }

    public OnClose(): void {
        this.$emit("closeSkill");
        
        this.resetValidation();
    }

    public async OnSave(): Promise<void> {
        let isValid = await this.$validator.validateAll("skillForm");

        if (!isValid) {
            this.notify.showWarning("Oh no, there are some errors on the form. Please fix these and try again.");
            
            return;
        }
        
        this.$emit("saveSkill", this.model);
        
        this.resetValidation();
    }

    private resetValidation(): void {        
        this.$nextTick(function () {
            // Ensure any previous validation triggers have been removed
            this.$validator.errors.clear("skillForm");
          });
    }
}