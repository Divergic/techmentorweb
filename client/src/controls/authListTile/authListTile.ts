import { Component, Watch } from "vue-property-decorator";
import AuthComponent from "../../components/authComponent";

@Component
export default class AuthListTile extends AuthComponent {
    public mounted(): void {
        this.EvaluateDisabled();
    }

    @Watch("$route")
    public OnRouteChanged(): void {
        this.EvaluateDisabled();
    }
}