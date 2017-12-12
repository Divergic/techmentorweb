import Component from "vue-class-component";
import AuthComponent from "../../components/authComponent";
import RegisterButton from "../../controls/registerButton/registerButton.vue";
import AuthButton from "../../controls/authButton/authButton.vue";
import AuthListTile from "../../controls/authListTile/authListTile.vue";
import RegisterListTile from "../../controls/registerListTile/registerListTile.vue";

@Component({
  components: {
      RegisterButton,
      AuthButton,
      AuthListTile,
      RegisterListTile
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