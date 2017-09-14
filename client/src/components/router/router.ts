import Vue from "vue";
import VueRouter from "vue-router";
import { UserService } from "../../services/authentication/userService";
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

    const userService = new UserService();

    router.beforeEach((to, from, next) => {
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!userService.isAuthenticated
          || userService.sessionExpired) {
          next({name: "signin", query: { redirectUri: to.fullPath }});

          return;
        }
      }

      // At this point we either don't require authentication or the user is authenticated
      if (to.matched.some(record => record.meta.requiresAuth && record.meta.requiresAdmin)) {
        if (!userService.isAdministrator) {
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