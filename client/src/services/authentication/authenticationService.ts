import { IConfig, Config } from "../config/config";
import { ILocation, Location } from "../location";
import AuthFailure from "./authFailure";
import Failure from "../failure";
import * as auth0 from "auth0-js";

export class SignInResponse {
    idToken: string;
    accessToken: string;
    isAdministrator: boolean;
}

export interface IAuthenticationService {
    Authenticate(returnUri?: string): void;
    IsAuthResponse(): boolean;
    ProcessAuthResponse(): Promise<SignInResponse>;
}

export class AuthenticationService implements IAuthenticationService {
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

    public IsAuthResponse(): boolean {
        let hash = this.location.getHash();

        if (hash && hash.length > 1) {
            return true;
        }

        return false;
    }

    public Authenticate(returnUri?: string): void {
        console.log("Authenticating the user");
        
        let location = this.location.getLocation();

        if (!returnUri) {
            returnUri = location.href;
        }

        console.log("Authenticating user and returning to " + returnUri);
        
        // Build the uri for the sign in page as the callback uri
        let callbackUri = this.location.makeAbsolute("/signin?redirectUri=" + encodeURIComponent(returnUri));

        this.auth0.authorize({
                audience: this.config.audience,
                redirectUri: callbackUri,
                responseType: this.config.responseType,
                scope: this.config.scope
            });            
    }
        
    public async ProcessAuthResponse(): Promise<SignInResponse> {
        console.log("Processing authentication response");

        let that = this;

        let failure = AuthFailure.createFrom(this.location.fromHash<AuthFailure>());

        if (failure.isFailure()) {
            // This looks like it is an authentication failure from a redirect
            throw new Failure(failure.error_description);
        }

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