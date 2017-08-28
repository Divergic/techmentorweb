import Vue from "vue";

export default class AuthComponent extends Vue {
    public isAuthenticated(): boolean {
        if (this.$store.getters["idToken"]) {
            return true;
        }

        return false;
    }
}