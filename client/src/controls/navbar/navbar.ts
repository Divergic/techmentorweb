import Component from "vue-class-component";
import AuthComponent from "../../components/authComponent";
import AuthButton from "../../controls/AuthButton/authButton.vue";

@Component({
  components: {
      AuthButton
  }
})
export default class NavBar extends AuthComponent {
  public isAdministrator(): boolean {
      if (!this.isAuthenticated()) {
        return false;
      }
      
      if (this.$store.getters["isAdministrator"]) {
          return true;
      }

      return false;
  }
};