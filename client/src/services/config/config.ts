export interface IConfig {
    apiUri: string;
    applicationInsightsKey: string;
    audience: string;
    authDomain: string;
    clientId: string;
    environment: string;
    responseType: string;
    scope: string;
    sentryDsn: string;
    version: string;
}

declare var webpackDefine: any;

export class Config implements IConfig {
    public apiUri: string = webpackDefine.apiUri;
    public applicationInsightsKey: string = webpackDefine.applicationInsightsKey;
    public audience: string = webpackDefine.audience;
    public authDomain: string = webpackDefine.authDomain;
    public clientId: string = webpackDefine.clientId;
    public environment: string = webpackDefine.environment;
    public responseType: string = webpackDefine.responseType;
    public scope: string = webpackDefine.scope;
    public sentryDsn: string = webpackDefine.sentryDsn;
    public version: string = webpackDefine.version;
}