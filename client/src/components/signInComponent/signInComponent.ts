import AuthComponent from "../authComponent";

export default class SignInComponent extends AuthComponent {
    public constructor() {
        super();
    }

    public click(): void {
        if (this.IsAuthenticated) {
            this.signOut();
        }
        else {
            this.signIn();
        }
    }

    public get text(): string {
        if (this.IsAuthenticated) {
            return "Sign out";
        }

        return "Sign in";
    }
}