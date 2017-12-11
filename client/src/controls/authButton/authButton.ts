import { Component, Watch } from "vue-property-decorator";
import SignInComponent from "../../components/signInComponent/signInComponent";

@Component
export default class AuthButton extends SignInComponent {
    public mounted(): void {
        this.EvaluateDisabled();
    }

    @Watch("$route")
    public OnRouteChanged(): void {
        this.EvaluateDisabled();
    }
}