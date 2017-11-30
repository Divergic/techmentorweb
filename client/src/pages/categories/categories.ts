import Component from "vue-class-component";
import Vue from "vue";
import { IAdminCategoriesService, AdminCategoriesService, AdminCategory, AdminUpdateCategory } from "../../services/api/adminCategoriesService";

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
    
    // Fields used for view binding
    public categorySets: Array<CategorySet> = new Array<CategorySet>();

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

    public async EnsureReviewed(category: AdminCategory): Promise<void> {
        if (category.reviewed) {
            return;
        }

        category.reviewed = true;

        let model = new AdminUpdateCategory(category);

        // Pushing an update to the API will automatically set the reviewed flag to true on the backend
        await this.adminCategoriesService.updateCategory(model);
    }

    public async UpdateCategory(category: AdminCategory): Promise<void> {
        let model = new AdminUpdateCategory(category);

        await this.adminCategoriesService.updateCategory(model);
    }

    private async loadCategories(): Promise<Array<CategorySet>> {
        let genders = new CategorySet("Genders");
        let languages = new CategorySet("Languages");
        let skills = new CategorySet("Skills");

        let categories = await this.adminCategoriesService.getCategories();

        categories.forEach(element => {
            if (element.group.toLowerCase() === "gender") {
                genders.categories.push(element);
            } 
            else if (element.group.toLowerCase() === "language") {
                languages.categories.push(element);
            }
            else {
                skills.categories.push(element);
            }
        });

        let sets = new Array<CategorySet>();

        sets.push(skills);
        sets.push(languages);
        sets.push(genders);
        
        return sets;
    }
} 