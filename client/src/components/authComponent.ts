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
            console.log("The authentication token has expired");
            
            return true;
        }

        // This debug code is written this way so that the whole statement can be removed on release builds
        // The function call is required because Date does not provide a fluent interface on setTime
        console.debug("Token expires at " + (function(){let date = new Date();date.setTime(storedValue * 1000);return date;})());

        return false;
    }
}