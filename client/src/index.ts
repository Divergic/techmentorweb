import "es6-promise/auto";
import Vue from "vue";
import Vuex from "vuex";
import VApp from "vuetify/es5/components/VApp";
import Vuetify from "vuetify/es5/components/Vuetify";
import VAlert from "vuetify/es5/components/VAlert";
import VBtn from "vuetify/es5/components/VBtn";
import VDialog from "vuetify/es5/components/VDialog";
import VForm from "vuetify/es5/components/VForm";
import VCard from "vuetify/es5/components/VCard";
import VSelect from "vuetify/es5/components/VSelect";
import VTextField from "vuetify/es5/components/VTextField";
import VList from "vuetify/es5/components/VList";
import VBottomNav from "vuetify/es5/components/VBottomNav";
import VToolbar from "vuetify/es5/components/VToolbar";
import VMenu from "vuetify/es5/components/VMenu";
import VIcon from "vuetify/es5/components/VIcon";
import VProgressCircular from "vuetify/es5/components/VProgressCircular";
import VCheckbox from "vuetify/es5/components/VCheckbox";
import VSubheader from "vuetify/es5/components/VSubheader";
import VSwitch from "vuetify/es5/components/VSwitch";
import VGrid from "vuetify/es5/components/VGrid";
import VDivider from "vuetify/es5/components/VDivider";
import VExpansionPanel from "vuetify/es5/components/VExpansionPanel";
import transitions from "vuetify/es5/components/transitions";
import * as VeeValidate from "vee-validate";
import StoreDataOptions from "./services/dataStore/storeDataOptions";
import Router from "./components/router/router";
import App from "./components/app/app.vue";
import VueAppInsights from "vue-application-insights";
import { Config } from "./services/config/config";
import Raven from "raven-js";
import RavenVue from "raven-js/plugins/vue";
require("./styles/theme.scss");

Vue.use(Vuex);
Vue.use(Vuetify, {
    components: {
      VApp,
      VAlert,
      VBtn,
      VDialog,
      VForm,
      VCard,
      VSelect,
      VTextField,
      VList,
      VBottomNav,
      VToolbar,
      VIcon,
      VMenu,
      VProgressCircular,
      VCheckbox,
      VSubheader,
      VSwitch,
      VGrid,
      VDivider,
      VExpansionPanel,
      transitions
    }
  });

VeeValidate.Validator.extend("noSlashes", {
    getMessage: field => "The " + field + " field must not contain / or \\.",
    validate: value => {
        let regex = /^[^/\\]*$/g;

        return regex.test(value);
    }
  });

Vue.use(VeeValidate);
 
class Application {

    constructor() {

        let storeOptions = new StoreDataOptions();
        const store = new Vuex.Store(storeOptions);
        
        const router = new Router().compile();

        const config = new Config();

        if (config.applicationInsightsKey
            && config.applicationInsightsKey.length > 0) {
            Vue.use(VueAppInsights, {
                id: config.applicationInsightsKey,
                router
              });
        }

        if (config.sentryDsn
            && config.sentryDsn.length > 0) {
            Raven.config(config.sentryDsn, {
                    environment: config.environment, 
                    release: config.version
                })
                .addPlugin(RavenVue, Vue)
                .install();

            // Determine if the user is already signed in
            let username = store.getters["username"];

            if (username 
                && username.length > 0) {
                Raven.setUserContext({
                        username: username
                    });
            }
        }
        
        new Vue({
            router: router,
            store: store,
            components: {
                App
            },
            render: h => h("App")
        }).$mount("#app");
    }
}

export default new Application();