import "es6-promise/auto";
import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import * as VeeValidate from "vee-validate";
import StoreDataOptions from "./services/dataStore/storeDataOptions";
import Router from "./components/router/router";
import App from "./components/app/app.vue";
import VueAppInsights from "vue-application-insights";
import { Config } from "./services/config/config";
require("./styles/theme.scss");

Vue.use(Vuex);
Vue.use(Vuetify);

VeeValidate.Validator.extend("noSlashes", {
    getMessage: field => "The " + field + " field must not contain / or \\.",
    validate: value => {
        let regex = /^[^/\\]+$/g;

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