import Component from "vue-class-component";
import AuthComponent from "../../components/authComponent";
import AuthButton from "../../controls/authButton/authButton.vue";
import AuthListTile from "../../controls/authListTile/authListTile.vue";

@Component({
  components: {
      AuthButton,
      AuthListTile
  }
})
export default class NavBar extends AuthComponent {
  public get IsAdministrator(): boolean {
      if (!this.IsAuthenticated) {
        return false;
      }
      
      if (this.$store.getters["isAdministrator"]) {
          return true;
      }

      return false;
  }
}