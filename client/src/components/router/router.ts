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