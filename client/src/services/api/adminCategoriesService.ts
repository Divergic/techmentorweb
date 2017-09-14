import { IHttp, Http } from "../http";

export enum AdminCategoryGroup {
    Skill = 0,
    Language,
    Gender
}

export class AdminCategory {
    group: AdminCategoryGroup;
    linkCount: number;
    name: string;
    reviewed: boolean;
    visible: boolean;
}

export interface IAdminCategoriesService {
    getCategories(): Promise<Array<AdminCategory>>;
}

export class AdminCategoriesService implements IAdminCategoriesService {
    public constructor(private http: IHttp = new Http()) {
    }

    public getCategories(): Promise<Array<AdminCategory>> {
        return this.http.get<Array<AdminCategory>>("categories/");
    }
}