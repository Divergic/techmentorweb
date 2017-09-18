import { IHttp, Http } from "../http";

export class CategoryGroup {
    public static Skill: string = "skill";
    public static Language: string = "language";
    public static Gender: string = "gender"
}

export class Category {
    group: string;
    linkCount: number;
    name: string;
}

export interface ICategoriesService {
    getCategories(): Promise<Array<Category>>;
}

export class CategoriesService implements ICategoriesService {
    public constructor(private http: IHttp = new Http()) {
    }

    public getCategories(): Promise<Array<Category>> {
        return this.http.get<Array<Category>>("categories/");
    }
}