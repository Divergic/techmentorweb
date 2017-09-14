import Vue from "vue";

export default class AuthComponent extends Vue {
    public isAuthenticated(): boolean {
        if (this.$store.getters["idToken"]) {
            return true;
        }

        return false;
    }

    public sessionExpired(): boolean {
        if (!this.isAuthenticated()) {
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
}