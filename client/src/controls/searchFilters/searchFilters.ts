import { Vue, Component, Watch } from "vue-property-decorator";
import { ICategoriesService, CategoriesService, Category, CategoryGroup } from "../../services/api/categoriesService";

const cacheExpiresInMilliseconds: number = 5 * 60000;   // Five minutes

@Component
export default class SearchFilters extends Vue {
    private categoriesService: ICategoriesService;
    
    private static categoriesCache: Array<Category> | null = null;
    private static cacheStoredAt: Date = new Date(Date.now());
    
    // Properties for view binding
    public loadingLists: boolean = true;
    public genders: Array<Category> = new Array<Category>();
    public languages: Array<Category> = new Array<Category>();
    public skills: Array<Category> = new Array<Category>();
    public selectedGender: string | null = null;
    public selectedLanguages: Array<string> = new Array<string>();
    public selectedSkills: Array<string> = new Array<string>();
    
    public constructor() {
        super();
        
        this.categoriesService = new CategoriesService();
    }
    
    public configure(categoriesService: ICategoriesService) {
        this.categoriesService = categoriesService;
    }

    public async mounted(): Promise<void> {
        await this.OnLoad();
    }

    public async OnLoad(): Promise<void> {
        await this.LoadCategories();
        await this.MatchFilters();
        this.RunSearch();
    }

    @Watch("$route")
    public async OnRouteChanged(): Promise<void> {
        await this.MatchFilters();
        this.RunSearch();
    }
    public async LoadCategories(): Promise<void> {     
        let categories = await this.getCategories();

        this.genders = categories
            .filter((item: Category) => {
                return item.group === CategoryGroup.Gender;
            });
        
        this.languages = categories
            .filter((item: Category) => {
                return item.group === CategoryGroup.Language;
            });

        this.skills = categories
            .filter((item: Category) => {
                return item.group === CategoryGroup.Skill;
            });
            
        this.loadingLists = false;
    }

    public async MatchFilters(): Promise<void> {
        let query = this.$router.currentRoute.query;

        // Parse out all the query filters
        let genderFilters = this.ParseQueryValues(query.gender);
        let languageFilters = this.ParseQueryValues(query.language);
        let skillFilters = this.ParseQueryValues(query.skill);
        
        let matchingGenders = this.FilterMatchingCategories(this.genders, genderFilters);

        if (matchingGenders.length > 0) {
            this.selectedGender = matchingGenders[0];
        }
        else {
            this.selectedGender = null;
        }
        
        this.selectedLanguages = this.FilterMatchingCategories(this.languages, languageFilters);
        this.selectedSkills = this.FilterMatchingCategories(this.skills, skillFilters);
    }
    
    public get FiltersSelected(): boolean {
        if (this.selectedSkills.length > 0) {
            return true;
        }
        
        if (this.selectedLanguages.length > 0) {
            return true;
        }

        if (this.selectedGender) {
            return true;
        }

        return false;
    }

    public RunSearch(): void {
        if (!this.FiltersSelected) {
            return;
        }

        this.$emit("runSearch", this.selectedGender, this.selectedLanguages, this.selectedSkills);        
    }
       
    public OnSearchClick(): void {
        // Navigate to the new URI       
        let query = <any>{            
        };

        if (this.selectedGender) {
            query.gender = this.selectedGender;
        }

        if (this.selectedLanguages.length > 0) {
            query.language = this.selectedLanguages;
        }

        if (this.selectedSkills.length > 0) {
            query.skill = this.selectedSkills;
        }

        this.$router.push({ name: "search", query: query});
    }
        
    private FilterMatchingCategories(categories: Array<Category>, filters: Array<string>): Array<string> {
        let matches = new Array<string>();

        for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
            let category = categories[categoryIndex].name;
            let categoryToMatch = category.toUpperCase();

            for (let filterIndex = 0; filterIndex < filters.length; filterIndex++) {
                let filter = filters[filterIndex].toUpperCase();

                if (categoryToMatch === filter) {
                    matches.push(category);
                }
            }
        }

        return matches;
    }

    private ParseQueryValues(value: any): Array<string> {
        if (!value) {
            return new Array<string>();
        }

        if (value instanceof Array) {
            // Looks like this is an array
            return <Array<string>>value;
        }

        // Assume this is a string
        return new Array<string>(<string>value);
    }

    private async getCategories(): Promise<Array<Category>> {
        let now = new Date(Date.now());

        if (SearchFilters.categoriesCache) {
            // We have a cache and now need to check if it has expired
            let cacheExpires = new Date(SearchFilters.cacheStoredAt.getTime() + cacheExpiresInMilliseconds);

            if (cacheExpires > now) {
                return SearchFilters.categoriesCache;
            }

            SearchFilters.categoriesCache = null;
        }
   
        let categories = await this.categoriesService.getCategories();
        let usedCategories = categories.filter((item: Category) => {
            return item.linkCount > 0;
        });

        SearchFilters.categoriesCache = usedCategories;
        SearchFilters.cacheStoredAt = now;

        return usedCategories;
    }

    public static Clear(): void {
        let now = new Date(Date.now());

        SearchFilters.categoriesCache = null;
        SearchFilters.cacheStoredAt = now;
    }
}