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

        let currentTime = new Date();
        
        // vuex seems to store values as strings so we need to convert it again even though TypeScript thinks the type is correct
        let storedValue = <string><any>this.$store.getters["tokenExpires"];

        if (!storedValue) {
            return true;
        }

        let convertedValue = new Date(storedValue);

        if (convertedValue <= currentTime) {
            return true;
        }

        return false;
    }
}