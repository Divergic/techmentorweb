import { IConfig, Config } from "../../services/config/config";
import { IDataStore, DataStore } from "../../services/dataStore/dataStore";

export class Headers {
    Authorization: string;
}

export interface IAvatarConfig {
    readonly PostAction: string;
    readonly Headers: Headers;
    GetAvatarUri(profileId: string, avatarId: string, eTag: string | null): string;
}

export class AvatarConfig implements IAvatarConfig {
    private _headers;
    private _postAction;

    public constructor(
        private config: IConfig = new Config(),
        store: IDataStore = new DataStore()) {

        let apiUri = this.BaseUri;

        apiUri += "profile/avatars/";

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

    public GetAvatarUri(profileId: string, avatarId: string, eTag: string | null): string {
        let apiUri = this.BaseUri;

        let query = "";

        if (eTag) {
            query = "?etag=" + encodeURIComponent(eTag);
        }

        apiUri += "profiles/" + encodeURI(profileId) + "/avatars/" + encodeURI(avatarId) + query;

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