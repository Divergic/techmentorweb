import "es6-promise/auto";
import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import * as VeeValidate from "vee-validate";
import StoreDataOptions from "./services/dataStore/storeDataOptions";

Vue.use(Vuex);
Vue.use(Vuetify);
Vue.use(VeeValidate);

import Router from "./components/router/router";
import App from "./components/app/app.vue";
require("./styles/theme.scss");
 
class Application {

    constructor() {

        let storeOptions = new StoreDataOptions();
        const store = new Vuex.Store(storeOptions);
        
        const router = new Router().compile();

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