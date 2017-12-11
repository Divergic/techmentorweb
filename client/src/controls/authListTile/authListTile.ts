import { Component, Watch } from "vue-property-decorator";
import SignInComponent from "../../components/signInComponent/signInComponent";

@Component
export default class AuthListTile extends SignInComponent {
    public mounted(): void {
        this.EvaluateDisabled();
    }

    @Watch("$route")
    public OnRouteChanged(): void {
        this.EvaluateDisabled();
    }
}