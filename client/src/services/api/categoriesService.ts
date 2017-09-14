import { IHttp, Http } from "../http";

export enum CategoryGroup {
    Skill = 0,
    Language,
    Gender
}

export class Category {
    group: CategoryGroup;
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