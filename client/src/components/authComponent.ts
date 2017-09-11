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

        let currentTime = new Date();
        let currentInUtc = new Date(currentTime.getUTCFullYear(), currentTime.getUTCMonth(), currentTime.getUTCDate(), currentTime.getUTCHours(), currentTime.getUTCMinutes(), currentTime.getUTCSeconds(), currentTime.getUTCMilliseconds());
        let secondsSinceEpoch = Date.UTC(currentInUtc.getUTCFullYear(), currentInUtc.getUTCMonth(), currentInUtc.getUTCDate(), currentInUtc.getUTCHours(), currentInUtc.getUTCMinutes(), currentInUtc.getUTCSeconds(), currentInUtc.getUTCMilliseconds()) / 1000;
        let nowSinceEpoch = Date.now() / 1000;
        console.log(secondsSinceEpoch + " - " + nowSinceEpoch);

        if (storedValue <= secondsSinceEpoch) {
            return true;
        }

        return false;
    }
}