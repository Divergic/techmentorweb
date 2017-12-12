import Vue from "vue";
import { ILocation, Location } from "../services/location";
import { Location as RouterLocation } from "vue-router";

export default class AuthComponent extends Vue {
    private location: ILocation;

    public disabled: boolean = false;

    public constructor() {
        super();

        this.location = new Location();
    }

    public init(location: ILocation) {
        this.location = location;
    }

    public get IsAuthenticated(): boolean {
        let token = this.$store.getters["idToken"];

        if (token) {
            return true;
        }

        return false;
    }

    public get SessionExpired(): boolean {
        if (!this.IsAuthenticated) {
            // The user isn't authenticated
            return true;
        }

        // vuex seems to store values as strings so we need to convert it again even though TypeScript thinks the type is correct
        let storedValue = <number><any>this.$store.getters["tokenExpires"];

        if (!storedValue) {
            return true;
        }

        let secondsSinceEpoch = Date.now() / 1000;

        if (storedValue <= secondsSinceEpoch) {
            console.warn("The authentication token has expired");
            
            return true;
        }

        let expiresAt = new Date();
        
        expiresAt.setTime(storedValue * 1000);
        
        console.info("Token expires at " + expiresAt);
        
        return false;
    }

    public register(): void {
        this.redirectToSignIn("signUp");
    }

    public signIn(): void {
        this.redirectToSignIn();
    }

    private redirectToSignIn(mode?: string): void {
        // Check if the current route has a sign in target
        let signInTarget = this.signInTarget();

        let query = { redirectUri: signInTarget };

        if (mode) {
            query["mode"] = mode;
        }

        // Redirect to the sign in page passing the sign in target
        this.$router.push({name: "signin", query: query});
    }

    public signOut(): void {
        let requiresRedirect = this.signOutRequiresRedirect();

        this.$store.commit("accessToken", null);
        this.$store.commit("email", null);
        this.$store.commit("firstName", null);
        this.$store.commit("idToken", null);
        this.$store.commit("isAdministrator", false);
        this.$store.commit("lastName", null);
        this.$store.commit("tokenExpires", null);

        if (requiresRedirect) {
            this.$router.push({ name: "home"});
        }
    }

    private signOutRequiresRedirect(): boolean {
        let route = this.$router.currentRoute;

        if (!route.meta) {
            return false;
        }

        if (route.meta.requiresAuth) {
            return true;
        }

        if (route.meta.signOutToHome) {
            return true;
        }

        return false;
    }

    private signInTarget(): string {
        let currentUri = this.location.getHref();
        let currentRoute = this.$router.currentRoute;

        if (!currentRoute.meta) {
            return currentUri;
        }

        let target = <string>currentRoute.meta.signInTarget;

        if (!target) {
            return currentUri;
        }

        let location = <RouterLocation>{
            name: target
        };
        let targetRoute = this.$router.resolve(location, currentRoute);

        return targetRoute.href;
    }

    public EvaluateDisabled(): void {
        let currentRoute = this.$router.currentRoute;
        
        if (currentRoute.name === "signin") {
            this.disabled = true;
        }
        else {
            this.disabled = false;
        }
    }
}