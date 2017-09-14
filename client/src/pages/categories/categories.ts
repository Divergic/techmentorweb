import Component from "vue-class-component";
import Vue from "vue";
import { IAdminCategoriesService, AdminCategoriesService, AdminCategory } from "../../services/api/adminCategoriesService";

export class CategorySet {
    public constructor(groupName: string) {
        this.groupName = groupName;
        this.categories = new Array<AdminCategory>();
    }

    groupName: string;
    categories: Array<AdminCategory>;
}

@Component
export default class Categories extends Vue {
    private adminCategoriesService: IAdminCategoriesService;
    private categorySets: Array<CategorySet> = new Array<CategorySet>();

    public constructor() {
        super();

        this.adminCategoriesService = new AdminCategoriesService();
    }

    public configure(
        adminCategoriesService: IAdminCategoriesService): void {
        this.adminCategoriesService = adminCategoriesService;
    }

    public mounted(): Promise<void> {
        return this.OnLoad();
    }

    public async OnLoad(): Promise<void> {
        this.categorySets = await this.loadCategories();
    }

    private async loadCategories(): Promise<Array<CategorySet>> {
        let genders = new CategorySet("Genders");
        let languages = new CategorySet("Languages");
        let skills = new CategorySet("Skills");

        let categories = await this.adminCategoriesService.getCategories();

        categories.forEach(element => {
            if (element.group === "gender") {
                genders.categories.push(element);
            } 
            else if (element.group === "language") {
                languages.categories.push(element);
            }
            else {
                skills.categories.push(element);
            }
        });

        let sets = new Array<CategorySet>();

        sets.push(genders);
        sets.push(languages);
        sets.push(skills);
        
        return sets;
    }
}; 