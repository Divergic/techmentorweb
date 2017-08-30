import Vue from "vue";
import VueRouter from "vue-router";
import { Authentication } from "../../services/authentication/authentication";

export default class Router {

  compile(): VueRouter {
    
    Vue.use(VueRouter);

    const routes = [
      { name: "home", path: "/", component: require.ensure([], function(require) { return require("../../pages/home/home.vue"); }, "app"), meta: { signInTarget: "profile" } },
      { name: "conduct", path: "/conduct/", component: require.ensure([], function(require) { return require("../../pages/conduct/conduct.vue"); }, "app.public"), meta: { signInTarget: "profile" } },
      { name: "signin", path: "/signin/", component: require.ensure([], function(require) { return require("../../pages/signin/signin.vue"); }, "app.auth") },
      { name: "profile", path: "/profile/", component: require.ensure([], function(require) { return require("../../pages/profile/profile.vue"); }, "app.profile"), meta: { requiresAuth: true } },
      { name: "notfound", path: "*", component: require.ensure([], function(require) { return require("../../pages/notfound/notfound.vue"); }, "app.public"), meta: { signInTarget: "profile" } }
    ];

    let router = new VueRouter(<VueRouter.RouterOptions>{
      mode: "history",
      routes: routes,
      scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition;
        } else {
          return { x: 0, y: 0 };
        }
      }
    });

    const authentication = new Authentication();

    router.beforeEach((to, from, next) => {
      if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!authentication.isAuthenticated) {          
          router.push({name: "signin", query: { redirectUri: to.fullPath }});

          return;
        } else {
          next();
        }
      } else {
        next(); // make sure to always call next()!
      }
    });

    return router;
  }
}