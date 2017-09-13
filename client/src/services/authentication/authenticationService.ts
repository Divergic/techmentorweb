import { IConfig, Config } from "../config/config";
import { ILocation, Location } from "../location";
import AuthFailure from "./authFailure";
import Failure from "../failure";
import * as auth0 from "auth0-js";

export class SignInResponse {
    idToken: string;
    accessToken: string;
    isAdministrator: boolean;
    tokenExpires: number;
}

export interface IAuthenticationService {
    Authenticate(returnUri: string): void;
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

    public Authenticate(returnUri: string): void {
        console.log("Authenticating user and returning to " + returnUri);
        
        let callbackUri = this.location.getSignInUri(returnUri);

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

                let issuedAt = <number>authResult.idTokenPayload.iat;
                let accessTokenLifespan = <number>authResult.expiresIn;
                let secondsSinceEpoc = issuedAt + accessTokenLifespan;

                // Allow for clock skew of a maximum of three minutes
                // Taking this off the token expiry means that the token will be seen as expired a few minutes before it actually does. 
                // This is only referenced when a HTTP call to the API returns a 401. Successful calls don't care. 
                // This avoids the issue of clock skew when the API returns 401 for an expired token
                // but the code here doesn't think it has expired. In this case, the Http class will display an unauthorized page rather than
                // cause an automatic redirect to re-authenticate.
                response.tokenExpires = secondsSinceEpoc - 180;

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