import Component from "vue-class-component";
import Vue from "vue";
import { IAdminCategoriesService, AdminCategoriesService, AdminCategory, AdminUpdateCategory } from "../../services/api/adminCategoriesService";

@Component
export default class Approve extends Vue {
    private adminCategoriesService: IAdminCategoriesService;
    
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
        let query = this.$router.currentRoute.query;
        let group = query.group;
        let name = query.name;
        
        let matchingCategory = await this.FindCategory(group, name);

        if (!matchingCategory) {
            this.$router.push({ name: "notfound"});

            return;
        }

        await this.ApproveCategory(matchingCategory.group, matchingCategory.name);

        this.$router.push({ name: "categories"});
    }

    public async ApproveCategory(group: string, name: string): Promise<void> {
        let model = new AdminUpdateCategory();

        model.group = group;
        model.name = name;
        model.visible = true;

        await this.adminCategoriesService.updateCategory(model);
    }

    private async FindCategory(group: string, name: string): Promise<AdminCategory | null> {
        let categories = await this.adminCategoriesService.getCategories();

        let matchingCategories = categories.filter((value: AdminCategory) => {
            if (value.group.toUpperCase() !== group.toUpperCase()) {
                return false;
            }

            if (value.name.toUpperCase() !== name.toUpperCase()) {
                return false;
            }

            return true;
        });

        if (matchingCategories.length > 0) {
            let matchingCategory = matchingCategories[0];

            return matchingCategory;
        }

        return null;
    }
} 