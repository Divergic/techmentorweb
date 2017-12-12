import { Component, Watch } from "vue-property-decorator";
import RegisterComponent from "../../components/registerComponent/registerComponent";

@Component
export default class RegisterButton extends RegisterComponent {
    public mounted(): void {
        this.EvaluateDisabled();
    }

    @Watch("$route")
    public OnRouteChanged(): void {
        this.EvaluateDisabled();
    }
}