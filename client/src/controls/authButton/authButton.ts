import Component from "vue-class-component";
import AuthComponent from "../../components/authComponent";
import { ILocation, Location } from "../../services/location";
import { Location as RouterLocation } from "vue-router";

@Component
export default class AuthButton extends AuthComponent {
    private location: ILocation;

    public constructor() {
        super();

        this.location = new Location();
    }

    public configure(location: ILocation) {
        this.location = location;
    }

    public signIn(): void {
        // Check if the current route has a sign in target
        let signInTarget = this.signInTarget();

        // Redirect to the sign in page passing the sign in target
        this.$router.push({name: "signin", query: { redirectUri: signInTarget }});
    }

    public signOut(): void {
        let requiresRedirect = this.signOutRequiresRedirect();

        this.$store.commit("accessToken", "");
        this.$store.commit("isAdministrator", "");
        this.$store.commit("idToken", "");

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

    public tooltip(): string {
        if (this.isAuthenticated()) {
            return "Sign out";
        }

        return "Sign in";
    };

};