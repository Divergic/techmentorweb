import { IHttp, Http } from "../http";

export class AdminCategory {
    group: string;
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