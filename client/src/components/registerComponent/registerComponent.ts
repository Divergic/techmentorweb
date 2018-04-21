import AuthComponent from "../authComponent/authComponent";

export default class RegisterComponent extends AuthComponent {
    public constructor() {
        super();
    }

    public click(): void {
        this.register();
    }
}