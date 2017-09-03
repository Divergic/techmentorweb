export default class AuthFailure {
    public error: string;
    public error_description: string;
    public state: string;

    public static createFrom(source: AuthFailure): AuthFailure {
        let value = new AuthFailure();

        if (source) {
            value.error = source.error;
            value.error_description = source.error_description;
            value.state = source.state;
        }

        return value;
    }

    public isFailure(): Boolean {
        if (!this.error || this.error.length === 0) {
            return false;
        }

        if (!this.error_description || this.error_description.length === 0) {
            return false;
        }

        if (!this.state || this.state.length === 0) {
            return false;
        }

        return true;
    }
}
