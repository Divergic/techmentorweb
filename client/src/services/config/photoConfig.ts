import { IConfig, Config } from "../config/config";
import { IDataStore, DataStore } from "../dataStore/dataStore";

export class Headers {
    Authorization: string;
}

export interface IPhotoConfig {
    readonly PostAction: string;
    readonly Headers: Headers;
    GetPhotoUri(profileId: string, photoId: string, hash: string | null): string;
}

export class PhotoConfig implements IPhotoConfig {
    private _headers;
    private _postAction;

    public constructor(
        private config: IConfig = new Config(),
        store: IDataStore = new DataStore()) {

        let apiUri = this.BaseUri;

        apiUri += "profile/photos/";

        this._postAction = apiUri;

        let headers = new Headers();

        if (store.accessToken) {
            headers.Authorization = "Bearer " + store.accessToken;
        }

        this._headers = headers;
    }
    
    public get PostAction(): string {
        return this._postAction;
    }

    public get Headers(): Headers {
        return this._headers;
    }

    public GetPhotoUri(profileId: string, photoId: string, hash: string | null): string {
        let apiUri = this.BaseUri;

        let query = "";

        if (hash) {
            query = "?hash=" + encodeURIComponent(hash);
        }

        apiUri += "profiles/" + encodeURI(profileId) + "/photos/" + encodeURI(photoId) + query;

        return apiUri;
    }

    private get BaseUri(): string {
        let apiUri = this.config.apiUri;

        if (apiUri.substr(apiUri.length - 1, 1) !== "/") {
            apiUri += "/";
        }

        return apiUri;
    }
}