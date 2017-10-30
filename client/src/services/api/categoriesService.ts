import { IHttp, Http } from "../http";

export class CategoryGroup {
    public static Skill: string = "skill";
    public static Language: string = "language";
    public static Gender: string = "gender";
}

export class Category {
    group: string;
    linkCount: number;
    name: string;

    public constructor(source: Category | null = null) {
        if (source) {
            this.group = source.group;
            this.linkCount = source.linkCount;
            this.name = source.name;
        }
        else {
            // Add default values so that properties exist for binding in the UI
            this.group = "";
            this.linkCount = 0;
            this.name = "";
        }
    }

    public get displayName(): string {
        return this.name + " (" + this.linkCount + ")";
    }
}

export interface ICategoriesService {
    getCategories(): Promise<Array<Category>>;
}

export class CategoriesService implements ICategoriesService {
    public constructor(private http: IHttp = new Http()) {
    }

    public async getCategories(): Promise<Array<Category>> {
        let categories = await this.http.get<Array<Category>>("categories/");

        // Sort the categories by case insensitive group and then name
        let sortedCategories = categories
            .map((category: Category) => {
                // Map to the copy constructor so that we have an instance of the class rather than just shaped data
                return new Category(category);
            })
            .sort((a: Category, b: Category) => {
                let firstGroup = a.group.toLocaleLowerCase();
                let secondGroup = b.group.toLocaleLowerCase();

                if (firstGroup < secondGroup) {
                    return -1;
                }
                
                if (firstGroup > secondGroup) {
                    return 1;
                }
                
                let firstName = a.name.toLocaleLowerCase();
                let secondName = b.name.toLocaleLowerCase();

                if (firstName < secondName) {
                    return -1;
                }

                if (firstName > secondName) {
                    return 1;
                }

                return 0;
            });

        return sortedCategories;
    }
}