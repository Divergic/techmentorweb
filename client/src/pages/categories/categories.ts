import Component from "vue-class-component";
import Vue from "vue";
import { IAdminCategoriesService, AdminCategoriesService, AdminCategory } from "../../services/api/adminCategoriesService";

@Component
export default class Categories extends Vue {
    private adminCategoriesService: IAdminCategoriesService;
    private categories: Array<AdminCategory> = new Array<AdminCategory>();

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
        this.categories = await this.adminCategoriesService.getCategories();
    }
}; 