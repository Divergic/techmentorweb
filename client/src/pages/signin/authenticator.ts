import { IConfig, Config } from "../../services/config/config";
import { ILocation, Location } from "../../services/location";
import AuthFailure from "./authFailure";
import Failure from "../../services/failure";
import * as auth0 from "auth0-js";

export class SignInResponse {
    idToken: string;
    accessToken: string;
    isAdministrator: boolean;
}

export interface IAuthenticator {
    Authenticate(): Promise<SignInResponse>;
}

export class Authenticator implements IAuthenticator {
    private auth0: auth0.WebAuth;

    public constructor(
        private location: ILocation = new Location(), 
        private config: IConfig = new Config()) {
        this.location = location;
        this.config = config;
        
        this.auth0 = new auth0.WebAuth({
            domain: this.config.authDomain,
            clientID: this.config.clientId
        });
    }

    public async Authenticate(): Promise<SignInResponse> {
        
        let failure = AuthFailure.createFrom(this.location.fromHash<AuthFailure>());

        if (failure.isFailure()) {
            // This looks like it is an authentication failure from a redirect
            throw new Failure(failure.error_description);
        }

        let hash = this.location.getHash();

        if (hash && hash.length > 1) {
            // Looks to be an authentication response in the uri
            console.log("Hash detected, processing authentication response");

            return await this.ProcessSignInResponse();
        }
        else {
            console.log("Authenticating the user");

            await this.Authorize();

            return <SignInResponse><any>null;
        }
    }

    public async Authorize(): Promise<void> {
        let that = this;

        return new Promise<void>(function(resolve, reject) {    
            console.log("Signing in");

            // We need to come back to the current location
            let currentUri = that.location.getHref();

            that.auth0.authorize({
                audience: that.config.audience,
                redirectUri: currentUri,
                responseType: that.config.responseType,
                scope: that.config.scope
            });

            resolve();
        });
    }
        
    public async ProcessSignInResponse(): Promise<SignInResponse> {
        let that = this;

        return new Promise<SignInResponse>(function(resolve, reject) {                  
            that.auth0.parseHash((err, authResult) => {
                if (err) {
                    reject(err);

                    return;
                }

                // Find any namespaced role claims
                let response = <SignInResponse>authResult;

                if (!authResult.idTokenPayload) {
                    resolve(response);

                    return;
                }

                let roles = authResult.idTokenPayload["http://techmentor/roles"] || [];
                
                if (roles.indexOf("Administrator") > -1) {
                    response.isAdministrator = true;
                }

                resolve(response);
            });
        });
    }
}