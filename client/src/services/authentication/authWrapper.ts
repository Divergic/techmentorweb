import { IConfig, Config } from "../config/config";
import { WebAuth } from "auth0-js";

export interface IAuthWrapper {
    authorize(callbackUri: string, mode?: string): void;
    parseHash(callback: AuthCallback): void;
}

type AuthCallback = (err: any, authResult: any) => void;

export class AuthWrapper implements IAuthWrapper {
    private auth0: WebAuth;

    public constructor(private config: IConfig = new Config()) {        
        this.auth0 = new WebAuth({
            domain: this.config.authDomain,
            clientID: this.config.clientId
        });
    }
    
    public authorize(callbackUri: string, mode?: string): void {        
        this.auth0.authorize({
            audience: this.config.audience,
            redirectUri: callbackUri,
            responseType: this.config.responseType,
            scope: this.config.scope,
            mode: mode
        });        
    }

    public parseHash(callback: AuthCallback): void {
        this.auth0.parseHash(callback);
    }
}