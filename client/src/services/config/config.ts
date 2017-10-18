export interface IConfig {
    apiUri: string;
    audience: string;
    authDomain: string;
    authorizeUri: string;
    clientId: string;
    responseType: string;
    scope: string;
    applicationInsightsKey: string;
}

declare var webpackDefine: any;

export class Config implements IConfig {
    public apiUri: string = webpackDefine.apiUri;
    public audience: string = webpackDefine.audience;
    public authDomain: string = webpackDefine.authDomain;
    public authorizeUri: string = webpackDefine.authorizeUri;
    public clientId: string = webpackDefine.clientId;
    public responseType: string = webpackDefine.responseType;
    public scope: string = webpackDefine.scope;
    public applicationInsightsKey: string = webpackDefine.applicationInsightsKey;
}