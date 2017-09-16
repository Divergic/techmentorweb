import { IHttp, Http } from "../http";

export class AdminCategory {
    public constructor(source: AdminCategory) {
        this.group = source.group;
        this.linkCount = source.linkCount;
        this.name = source.name;
        this.reviewed = source.reviewed;
        this.visible = source.visible;
        this.requiresUpdate = false;
    }

    private reviewedState: boolean;
    private visibleState: boolean;

    group: string;
    linkCount: number;
    name: string;
    requiresUpdate: boolean;

    get reviewed(): boolean {
        return this.reviewedState;
    };
    set reviewed(value: boolean)
    {
        this.reviewedState = value;
        this.requiresUpdate = true;
    };

    get visible(): boolean {
        return this.visibleState;
    };
    set visible(value: boolean)
    {
        this.visibleState = value;
        this.requiresUpdate = true;
    };
}

export class AdminUpdateCategory {
    group: string;
    name: string;
    visible: boolean;

    public constructor(model?: AdminCategory) {
        if (!model) {
            this.visible = false;
            
            return;
        }

        this.group = model.group;
        this.name = model.name;
        this.visible = model.visible;
    }
}

class UpdateModel {
    visible: boolean;

    public constructor(model: AdminUpdateCategory) {
        this.visible = model.visible;
    }
}

export interface IAdminCategoriesService {
    getCategories(): Promise<Array<AdminCategory>>;
    updateCategory(model: AdminUpdateCategory): Promise<void>;
}

export class AdminCategoriesService implements IAdminCategoriesService {
    public constructor(private http: IHttp = new Http()) {
    }

    public getCategories(): Promise<Array<AdminCategory>> {
        return this.http.get<Array<AdminCategory>>("categories/");
    }

    public updateCategory(model: AdminUpdateCategory): Promise<void> {
        let resource = "categories/" + model.group + "/" + encodeURIComponent(model.name);
        let updateModel = new UpdateModel(model);

        return this.http.put<UpdateModel, void>(resource, updateModel);
    }
}