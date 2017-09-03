import Vue from "vue";
import VueRouter from "vue-router";
import { Authentication } from "../../services/authentication/authentication";
import Routes from "./routes";
 
export default class Router {

  compile(): VueRouter {
    
    Vue.use(VueRouter);
 
    let router = new VueRouter(<VueRouter.RouterOptions>{
      mode: "history",
      routes: Routes,
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
        if (!authentication.isAuthenticated) {          
          next({name: "signin", query: { redirectUri: to.fullPath }});

          return;
        }
      }

      // At this point we either don't require authentication or the user is authenticated
      if (to.matched.some(record => record.meta.requiresAuth && record.meta.requiresAdmin)) {
        if (!authentication.isAdministrator) {
          next({name: "unauthorized" });

          return;
        }
      }

      // Always make a call to next()
      next();
    });

    return router;
  }
}