import Component from "vue-class-component";
import AuthComponent from "../../components/authComponent";
import { IAuthenticator, Authenticator } from "./authenticator";

@Component
export default class SignIn extends AuthComponent {
    private authenticator: IAuthenticator;

    public constructor() {
        super();

        this.authenticator = new Authenticator();
    }

    public configure(
        authenticator: IAuthenticator): void {
        this.authenticator = authenticator;
    }

    public mounted(): Promise<void> {
        return this.OnLoad();
    }

    public async OnLoad(): Promise<void> {
        let authenticated = await this.Authenticate();

        if (!authenticated) {
            return;
        }

        this.redirect();        
    }

    private redirect(): void {
        let redirectUri = this.getRedirectUri();

        if (!redirectUri) {
            this.$router.replace({ name: "profile" });

            return;
        }

        // Ensure that the redirect uri is not rooted
        let parsedUri = redirectUri.replace(/^(ht|f)tp(s)?:\/\/[^\/]+/i, "");

        this.$router.replace(parsedUri);
    }

    public async Authenticate(): Promise<Boolean> {
        if (this.isAuthenticated()) {
            // The user already has an auth session
            console.log("User is already authenticated");

            return true;
        }
        else {
            // The user does not yet have an auth session
            console.log("Authenticating");
            let response = await this.authenticator.Authenticate();

            if (response) {
                // Store session context
                this.$store.commit("idToken", response.idToken);
                this.$store.commit("accessToken", response.accessToken);
                this.$store.commit("isAdministrator", response.isAdministrator);

                return true;
            } else {
                // We are redirecting to authenticate
                return false;
            }
        }
    };

    private getRedirectUri (): string {
        let uri = this.$route.query.redirectUri;

        if (uri) {
            return uri;
        }

        return this.getHomeUri();
    }

    private getHomeUri(): string {
        let currentRoute = this.$router.currentRoute;
        let location = <any>{
            name: "home"
        };
        let targetRoute = this.$router.resolve(location, currentRoute);

        return targetRoute.href;
    }
};